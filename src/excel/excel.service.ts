import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { History } from 'src/history/entities/history.entity';
import { Buffer } from 'buffer';
import axios from 'axios';

@Injectable()
export class ExcelService {
  async generateExcel(
    history: History,
    generatedBy = 'Sistema',
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Rota');

    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `Relatório da Rota #${history.id}`;
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getRow(1).height = 40;

    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value =
      `Gerado em ${new Date().toLocaleString('pt-BR')} por ${generatedBy}`;
    worksheet.getCell('A2').font = { italic: true, size: 10 };
    worksheet.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const logoUrl =
      'https://static.wixstatic.com/media/f19bb9_c7bbcca3a3684546bb14455c45edff18~mv2.png/v1/fill/w_260,h_122,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LOGO.png';
    const logoImageId = await this.loadImageFromUrl(workbook, logoUrl);
    worksheet.addImage(logoImageId, {
      tl: { col: 5.5, row: 0 },
      ext: { width: 120, height: 60 },
    });

    let currentRow = 4;

    const addSection = (
      startCol: 'A' | 'E',
      title: string,
      data: [string, any][],
    ) => {
      worksheet.getCell(`${startCol}${currentRow}`).value = title;
      worksheet.getCell(`${startCol}${currentRow}`).font = { bold: true };
      currentRow++;

      data.forEach(([label, value]) => {
        worksheet.getCell(`${startCol}${currentRow}`).value = label;
        worksheet.getCell(
          String.fromCharCode(startCol.charCodeAt(0) + 1) + `${currentRow}`,
        ).value = value;
        currentRow++;
      });

      currentRow++; // espaço extra entre seções
    };

    // Seções coluna esquerda
    currentRow = 4;
    addSection('A', 'Dados do Motorista', [
      ['Nome', history.driver?.name || '-'],
      ['CNH', history.driver?.cnh || '-'],
      ['CPF', history.driver?.cpf || '-'],
    ]);

    addSection('A', 'Dados da Rota', [
      ['Origem', history.route?.path?.origin || '-'],
      ['Destino', history.route?.path?.destination || '-'],
      ['Paradas', history.route?.path?.stops?.join(', ') || '-'],
      ['Distância Estimada', history.route?.estimatedDistance || '-'],
      ['Duração Estimada', history.route?.estimatedDuration || '-'],
    ]);

    addSection('A', 'Dados da Viagem', [
      ['Início', new Date(history.startedAt).toLocaleString('pt-BR')],
      ['Fim', new Date(history.endedAt).toLocaleString('pt-BR')],
      ['Odômetro Inicial', history.odometerInitial ?? '-'],
      ['Odômetro Final', history.odometerFinal ?? '-'],
    ]);

    // Seções coluna direita
    currentRow = 4;
    addSection('E', 'Dados do Veículo', [
      ['Placa', history.vehicle?.plate || '-'],
      ['Modelo', history.vehicle?.model || '-'],
      ['Tipo', history.vehicle?.type || '-'],
      ['Capacidade', history.vehicle?.capacity || '-'],
    ]);

    /* currentRow = 5;
    //addSection('F', 'Imagens do Odometro', [
      
    ]); */

    addSection('E', 'Aprovação', [
      ['Status', this.translateStatus(history.approval?.status)],
      ['Aprovado por', history.approval?.approvedBy?.name || '-'],
      [
        'Data',
        history.approval?.date
          ? new Date(history.approval.date).toLocaleString('pt-BR')
          : '-',
      ],
      ['Observações', history.approval?.observation || '-'],
    ]);

    // Ajusta larguras
    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 30;
    worksheet.getColumn('C').width = 5;
    worksheet.getColumn('D').width = 5;
    worksheet.getColumn('E').width = 20;
    worksheet.getColumn('F').width = 30;

    // Aplica bordas em toda a área preenchida
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        if (rowNumber > 2) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', wrapText: true };
        }
      });
    });

    worksheet.views = [{ state: 'frozen', ySplit: 3 }];

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async loadImageFromUrl(
    workbook: ExcelJS.Workbook,
    url: string,
  ): Promise<number> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    return workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    });
  }

  private translateStatus(status?: number) {
    const map = {
      0: 'Pendente',
      1: 'Aprovado',
      2: 'Reprovado',
    };
    return map[status] || 'Desconhecido';
  }
}

import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { History } from 'src/history/entities/history.entity';
import { Buffer } from 'buffer';
import fetch from 'node-fetch';

@Injectable()
export class ExcelService {
  async generateExcel(history: History): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Rotas');

    // TÍTULO - Mesclar A1 até G1
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Relatório da Rota ${history.id}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Define altura da linha 1
    worksheet.getRow(1).height = 50;

    // Logo no canto superior direito (coluna G)
    const logoUrl =
      'https://static.wixstatic.com/media/f19bb9_c7bbcca3a3684546bb14455c45edff18~mv2.png/v1/fill/w_260,h_122,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LOGO.png';
    const logoImageId = await this.loadImageFromUrl(workbook, logoUrl);
    worksheet.addImage(logoImageId, {
      tl: { col: 6, row: 0 }, // Coluna G (índice 6), linha 0
      ext: { width: 120, height: 60 },
    });

    // Cabeçalho na linha 2
    const headerValues = [
      'Data',
      'Motorista',
      'Placa',
      'Origem',
      'Destino',
      'Distância ',
      'Status',
    ];
    worksheet.addRow(headerValues);

    // Estilização do cabeçalho (linha 2)
    const headerRow = worksheet.getRow(2);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF007ACC' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Dados do histórico na linha 3
    const formatted = [
      new Date(history.startedAt).toLocaleDateString('pt-BR'),
      history.driver?.name || 'Desconhecido',
      history.vehicle?.plate || '-',
      history.path?.origin || '-',
      history.path?.destination || '-',
      history.elapsedDistance ?? '-',
      this.translateStatus(history.approval?.status),
    ];
    worksheet.addRow(formatted);

    // Definindo larguras das colunas
    worksheet.columns = [
      { width: 15 }, // Data
      { width: 25 }, // Motorista
      { width: 15 }, // Placa
      { width: 20 }, // Origem
      { width: 20 }, // Destino
      { width: 15 }, // Distância
      { width: 15 }, // Status
    ];

    // Estilo das demais linhas
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
      } else {
        row.height = 22;
        row.alignment = { vertical: 'middle', wrapText: true };
        row.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });

    // Congela até a linha 2
    worksheet.views = [{ state: 'frozen', ySplit: 2 }];

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // Carrega imagem remota e retorna ID
  private async loadImageFromUrl(
    workbook: ExcelJS.Workbook,
    url: string,
  ): Promise<number> {
    const response = await fetch(url);
    const imageBuffer = await response.buffer();
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

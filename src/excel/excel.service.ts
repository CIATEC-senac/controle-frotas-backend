import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { History } from 'src/history/entities/history.entity';
import { Buffer } from 'buffer';
import axios from 'axios';
import { RouteService } from 'src/route/route.service';

@Injectable()
export class ExcelService {
  constructor(
    @Inject(forwardRef(() => RouteService))
    private readonly routeService: RouteService,
  ) {}

  async generateExcel(
    history: History,
    generatedBy = 'Sistema',
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Rota');

    // Estilos básicos
    const headerStyle = {
      font: { size: 16, bold: true, color: { argb: '000000' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF' },
      },
      alignment: { vertical: 'middle', horizontal: 'center' },
    };

    const tableHeaderStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Definindo largura das colunas (A-T)
    worksheet.columns = [
      { width: 25 }, // A - Nome (motorista)
      { width: 15 }, // B - Matrícula
      { width: 15 }, // C - CNH
      { width: 15 }, // D - Placa
      { width: 20 }, // E - Modelo
      { width: 20 }, // F - Origem
      { width: 20 }, // G - Destino
      { width: 20 }, // H - Paradas Realizadas
      { width: 20 }, // I - Distância Estimada
      { width: 20 }, // J - Duração Estimada
      { width: 20 }, // K - Início
      { width: 20 }, // L - Fim
      { width: 20 }, // M - Odômetro Inicial
      { width: 20 }, // N - Odômetro Final
      { width: 20 }, // O - Tempo Estimado
      { width: 20 }, // P - Distância Total
      { width: 20 }, // Q - Velocidade Média
      { width: 20 }, // R - Aprovado por
      { width: 20 }, // S - Data da Aprovação
      { width: 30 }, // T - Observações
    ];

    // Cabeçalho principal
    worksheet.mergeCells('A1:T1');
    worksheet.getCell('A1').value = `RELATÓRIO DA ROTA #${history.id}`;
    Object.assign(worksheet.getCell('A1'), headerStyle);
    worksheet.getRow(1).height = 30;

    // Linha de geração
    worksheet.mergeCells('A2:T2');
    worksheet.getCell('A2').value =
      `Gerado em ${new Date().toLocaleString('pt-BR')} por ${generatedBy}`;
    worksheet.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getCell('A2').font = { italic: true, size: 10 };

    // Logo
    const logoUrl =
      'https://static.wixstatic.com/media/f19bb9_c7bbcca3a3684546bb14455c45edff18~mv2.png/v1/fill/w_260,h_122,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LOGO.png';
    const logoImageId = await this.loadImageFromUrl(workbook, logoUrl);
    worksheet.addImage(logoImageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 100, height: 50 },
    });

    // Cabeçalhos das colunas (linha 4)
    const headersRow = worksheet.getRow(4);
    const headers = [
      'Nome (motorista)', // A
      'Matrícula', // B
      'CNH', // C
      'Placa', // D
      'Modelo', // E
      'Origem', // F
      'Destino', // G
      'Paradas Realizadas', // H
      'Distância Estimada', // I
      'Duração Estimada', // J
      'Início', // K
      'Fim', // L
      'Odômetro Inicial', // M
      'Odômetro Final', // N
      'Tempo Estimado', // O
      'Distância Total', // P
      'Velocidade Média', // Q
      'Aprovado por', // R
      'Data da Aprovação', // S
      'Observações', // T
    ];

    headers.forEach((header, index) => {
      const cell = headersRow.getCell(index + 1);
      cell.value = header;
      Object.assign(cell, tableHeaderStyle);
    });

    // Preenchendo os dados (linha 5)
    const dataRow = worksheet.getRow(5);
    const routeStats = await this.routeService.getRouteStatistics(
      history.route.id,
    );

    // Dados básicos
    dataRow.getCell(1).value = history.driver?.name || '-'; // Nome
    dataRow.getCell(2).value = history.driver?.registration || '-'; // Matrícula
    dataRow.getCell(3).value = history.driver?.cnh || '-'; // CNH
    dataRow.getCell(4).value = history.vehicle?.plate || '-'; // Placa
    dataRow.getCell(5).value = history.vehicle?.model || '-'; // Modelo
    dataRow.getCell(6).value = history.route?.path?.origin || '-'; // Origem
    dataRow.getCell(7).value = history.route?.path?.destination || '-'; // Destino

    // Paradas
    if (history.route?.path?.stops?.length) {
      dataRow.getCell(8).value = history.route.path.stops.join(', ');
    } else {
      dataRow.getCell(8).value = '-';
    }

    // Dados da rota
    dataRow.getCell(9).value = history.route?.estimatedDistance || '-'; // Distância Estimada
    dataRow.getCell(10).value = history.route?.estimatedDuration || '-'; // Duração Estimada

    // Dados da viagem
    dataRow.getCell(11).value = history.startedAt
      ? new Date(history.startedAt).toLocaleString('pt-BR')
      : '-'; // Início
    dataRow.getCell(12).value = history.endedAt
      ? new Date(history.endedAt).toLocaleString('pt-BR')
      : '-'; // Fim
    dataRow.getCell(13).value = history.odometerInitial || '-'; // Odômetro Inicial
    dataRow.getCell(14).value = history.odometerFinal || '-'; // Odômetro Final

    // Estatísticas
    dataRow.getCell(15).value = routeStats?.durationMin || '-'; // Tempo Estimado
    dataRow.getCell(16).value = routeStats?.distanceKm || '-'; // Distância Total
    dataRow.getCell(17).value = routeStats?.averageSpeedKmH || '-'; // Velocidade Média

    // Aprovação
    dataRow.getCell(18).value = history.approval?.approvedBy?.name || '-'; // Aprovado por
    dataRow.getCell(19).value = history.approval?.date
      ? new Date(history.approval.date).toLocaleString('pt-BR')
      : '-'; // Data da Aprovação
    dataRow.getCell(20).value = history.approval?.observation || '-'; // Observações

    // Aplicando bordas a todas as células de dados
    for (let i = 1; i <= 20; i++) {
      dataRow.getCell(i).border = borderStyle;
    }

    // Adicionando linhas vazias conforme mostrado na imagem (linhas 6-22)
    for (let i = 6; i <= 22; i++) {
      const emptyRow = worksheet.getRow(i);
      for (let j = 1; j <= 20; j++) {
        emptyRow.getCell(j).value = '';
        emptyRow.getCell(j).border = borderStyle;
      }
    }

    // Exporta o arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private async loadImageFromUrl(
    workbook: ExcelJS.Workbook,
    url: string,
  ): Promise<number> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return workbook.addImage({
      buffer: Buffer.from(response.data),
      extension: 'png',
    });
  }
}

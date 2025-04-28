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

    const sectionTitleStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      },
      alignment: { vertical: 'middle', horizontal: 'left' },
    };

    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Definindo largura das colunas
    worksheet.columns = [
      { width: 25 }, // Coluna A
      { width: 70 }, // Coluna B
    ];

    // Cabeçalho principal
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = `RELATÓRIO DA ROTA #${history.id}`;
    Object.assign(worksheet.getCell('A1'), headerStyle);
    worksheet.getRow(1).height = 30;

    // Linha de geração
    worksheet.mergeCells('A2:B2');
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

    let currentRow = 4;

    // Função auxiliar para criar seção
    const createSection = (title: string) => {
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = title;
      Object.assign(worksheet.getCell(`A${currentRow}`), sectionTitleStyle);
      worksheet.getRow(currentRow).height = 20;
      currentRow++;
    };

    // Função auxiliar para adicionar linha de dados
    const addRow = (label: string, value: any) => {
      worksheet.getCell(`A${currentRow}`).value = label;
      worksheet.getCell(`B${currentRow}`).value = value ?? '-';

      worksheet.getCell(`A${currentRow}`).border = borderStyle;
      worksheet.getCell(`B${currentRow}`).border = borderStyle;

      worksheet.getCell(`A${currentRow}`).alignment = {
        vertical: 'middle',
        horizontal: 'left',
      };
      worksheet.getCell(`B${currentRow}`).alignment = {
        vertical: 'middle',
        horizontal: 'left',
      };

      currentRow++;
    };

    // Dados do Motorista
    createSection('DADOS DO MOTORISTA');
    addRow('Nome', history.driver?.name);
    addRow('Matrícula', history.driver?.registration);
    addRow('CNH', history.driver?.cnh);
    addRow('CPF', history.driver?.cpf);

    worksheet.addRow([]);
    currentRow++;

    // Dados do Veículo
    createSection('DADOS DO VEÍCULO');
    addRow('Placa', history.vehicle?.plate);
    addRow('Modelo', history.vehicle?.model);
    addRow('Tipo', history.vehicle?.type);
    addRow('Capacidade', history.vehicle?.capacity);

    worksheet.addRow([]);
    currentRow++;

    // Dados da Rota
    createSection('DADOS DA ROTA');
    addRow('Origem', history.route?.path?.origin);
    addRow('Destino', history.route?.path?.destination);

    // Tratamento especial para as paradas
    if (history.route?.path?.stops?.length) {
      worksheet.getCell(`A${currentRow}`).value = 'Paradas';
      worksheet.getCell(`A${currentRow}`).border = borderStyle;
      worksheet.getCell(`A${currentRow}`).alignment = {
        vertical: 'middle',
        horizontal: 'left',
      };

      // Adiciona cada parada em uma linha separada na coluna B
      let firstStop = true;
      for (const stop of history.route.path.stops) {
        if (!firstStop) {
          currentRow++;
        }
        worksheet.getCell(`B${currentRow}`).value = stop;
        worksheet.getCell(`B${currentRow}`).border = borderStyle;
        worksheet.getCell(`B${currentRow}`).alignment = {
          vertical: 'middle',
          horizontal: 'left',
        };
        firstStop = false;
      }
      currentRow++;
    } else {
      addRow('Paradas', '-');
    }

    addRow('Distância Estimada', history.route?.estimatedDistance);
    addRow('Duração Estimada', history.route?.estimatedDuration);

    worksheet.addRow([]);
    currentRow++;

    // Dados da Viagem
    createSection('DADOS DA VIAGEM');
    addRow(
      'Início',
      history.startedAt
        ? new Date(history.startedAt).toLocaleString('pt-BR')
        : '-',
    );
    addRow(
      'Fim',
      history.endedAt ? new Date(history.endedAt).toLocaleString('pt-BR') : '-',
    );
    addRow('Odômetro Inicial', history.odometerInitial);
    addRow('Odômetro Final', history.odometerFinal);

    worksheet.addRow([]);
    currentRow++;

    // Estatísticas da Rota
    const routeStats = await this.routeService.getRouteStatistics(
      history.route.id,
    );

    createSection('ESTATÍSTICAS DA ROTA');
    addRow('Tempo Estimado', routeStats?.durationMin);
    addRow('Distância Total', routeStats?.distanceKm);
    addRow('Paradas Realizadas', routeStats?.stopsCount);
    addRow('Velocidade Média', routeStats?.averageSpeedKmH);

    worksheet.addRow([]);
    currentRow++;

    // Dados de Aprovação
    createSection('DADOS DE APROVAÇÃO');
    addRow('Aprovado por', history.approval?.approvedBy?.name);
    addRow(
      'Data da Aprovação',
      history.approval?.date
        ? new Date(history.approval.date).toLocaleString('pt-BR')
        : '-',
    );
    addRow('Observações', history.approval?.observation);

    // Exporta o arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // Função para carregar imagem via URL
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

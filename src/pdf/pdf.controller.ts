import {
  Controller,
  Get,
  Header,
  Param,
  Render,
  StreamableFile,
} from '@nestjs/common';
import { Buffer } from 'buffer';
import * as dayjs from 'dayjs';

import { HistoryService } from 'src/history/history.service';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly historyService: HistoryService,
  ) {}

  @Get(':id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=relatorio.pdf')
  async printPDF(@Param('id') id: string) {
    const url = `http://localhost:3000/pdf/print/${id}`;
    const data = await this.pdfService.generatePdf(url);
    return new StreamableFile(Buffer.from(data));
  }

  @Get('print/:id')
  @Render('templates/route') // Certifique-se que esse template existe!
  async renderPDF(@Param('id') id: string) {
    const history = await this.historyService.findOne(Number(id));

    const translatedRoles = {
      0: 'Administrador',
      1: 'Gerente',
      2: 'Motorista',
    };

    const translatedStatus = {
      0: 'Pendente',
      1: 'Aprovado',
      2: 'Reprovado',
    };

    const date = history.startedAt
      ? dayjs(history.startedAt).format('DD/MM/YYYY')
      : '';

    const startedAt = history.startedAt
      ? dayjs(history.startedAt).format('HH:mm')
      : null;

    const endedAt = history.endedAt
      ? dayjs(history.endedAt).format('HH:mm')
      : null;

    history.route.estimatedDistance = Number(
      (history.route.estimatedDistance / 1000).toFixed(2),
    );

    history.route.estimatedDuration = Number(
      (history.route.estimatedDistance / 60).toFixed(2),
    );

    const unplannedStopOptions = {
      0: 'Trânsito',
      1: 'Via interditada',
      2: 'Faixa bloqueada',
      3: 'Combustível',
      4: 'Problema mecânico',
      5: 'Acidente',
    };

    return {
      date: dayjs().format('DD/MM/YYYY HH:mm:ss'),
      history: {
        ...history,
        date: date,
        startedAt: startedAt ?? '-',
        endedAt: endedAt ?? '-',
        unplannedStops: (history.unplannedStops ?? []).map((stop) => {
          return {
            date: dayjs(stop.date).format('DD/NN/YYYY HH:mm:ss'),
            type: unplannedStopOptions[stop.type],
          };
        }),
        status: translatedStatus[history.approval?.status] ?? 'Pendente',
        role: translatedRoles[history.driver?.role] ?? 'Desconhecido',
      },
    };
  }
}

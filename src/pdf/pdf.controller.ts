import { Controller, Get, Param, Render, StreamableFile } from '@nestjs/common';
import { Buffer } from 'buffer';
import * as dayjs from 'dayjs';

import { Roles } from 'src/auth/roles.decorator';
import { HistoryService } from 'src/history/history.service';
import { UserRole } from 'src/user/entities/user.entity';
import { PdfService } from './pdf.service';

// @UseGuards(AuthGuard, RolesGuard)
@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly historyService: HistoryService,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get(':id')
  async printPDF(@Param('id') id: string) {
    const url = `http://localhost:3000/pdf/print/${id}`;
    const data = await this.pdfService.generatePdf(url);
    return new StreamableFile(Buffer.from(data));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
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

    const start = history.startedAt ? dayjs(history.startedAt) : null;
    const end = history.endedAt ? dayjs(history.endedAt) : null;

    return {
      date: dayjs().format('DD/MM/YYYY'),
      history: {
        ...history,
        date: start ? start.format('DD/MM/YYYY') : '-',
        start: start ? start.format('HH:mm') : '-',
        finish: end ? end.format('HH:mm') : '-',
        status: translatedStatus[history.approval?.status] ?? 'Pendente',
        role: translatedRoles[history.driver?.role] ?? 'Desconhecido',
      },
    };
  }
}

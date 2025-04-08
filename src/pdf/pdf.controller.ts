import { Controller, Get, Logger, Param, StreamableFile } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Render } from '@nestjs/common';
import { Buffer } from 'buffer';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  async printPDF() {
    const url = `http://localhost:3000/pdf/print/1`;

    const data = await this.pdfService.generatePdf(url);

    return new StreamableFile(Buffer.from(data));
  }

  @Get('print/:userId')
  @Render('templates/route')
  async renderPDF(@Param('userId') userId: string) {
    new Logger().log(`User id: ${userId}`);

    return {
      pdf: [
        {
          name: 'Name',
          route: 'Route',
          time: 'Time',
        },
      ],
    };
  }
}

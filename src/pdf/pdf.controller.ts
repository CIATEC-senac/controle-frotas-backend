import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  async getPdf(@Res() res: Response) {
    const pdf = await this.pdfService.generatePdf();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="relatorio.pdf"',
    });
    res.send(pdf);
  }
}

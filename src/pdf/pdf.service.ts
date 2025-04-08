import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generatePdf(): Promise<Buffer> {
    const pdf = [
      { name: 'Joyce', rote: 7859, time: '18h00' },
      { name: 'Brock', rote: 7859, time: '18h00' },
      { name: 'Eve', rote: 7859, time: '18h00' },
    ];

    const templatePath = path.join(__dirname, '..', 'templates', 'print.ejs');

    const html = await ejs.renderFile(templatePath, { pdf });

    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      printBackground: true,
      format: 'Letter',
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generatePdf(url: string) {
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 1000,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    new Logger().debug('launch');

    const page = await browser.newPage();

    new Logger().debug('new page');

    await page.goto(url, { waitUntil: 'networkidle0' });

    new Logger().debug('goto');

    const pdf = await page.pdf({ format: 'A4' });

    new Logger().debug('pdf');

    await browser.close();

    new Logger().debug('close');

    return pdf;
  }
}

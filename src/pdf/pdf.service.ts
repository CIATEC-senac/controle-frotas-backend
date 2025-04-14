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

    new Logger().debug('Puppeteer launched');

    const page = await browser.newPage();

    new Logger().debug('New page created');

    try {
      await page.goto(url, { waitUntil: 'networkidle0' });
      new Logger().debug('Page loaded');
    } catch (error) {
      new Logger().error(`Error loading page: ${error.message}`);
    }

    try {
      const pdf = await page.pdf({ format: 'A4' });
      new Logger().debug('PDF generated');
      return pdf;
    } catch (error) {
      new Logger().error(`Error generating PDF: ${error.message}`);
    } finally {
      await browser.close();
      new Logger().debug('Browser closed');
    }
  }
}

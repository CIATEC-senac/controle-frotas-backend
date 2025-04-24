import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  private browser: puppeteer.Browser;

  constructor() {
    puppeteer
      .launch({
        headless: true,
        timeout: 0,
        pipe: true,
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
      .then((browser) => {
        this.browser = browser;
      });
  }

  async launchBrowser() {
    if (this.browser) {
      return;
    }

    this.browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
      pipe: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async generatePdf(url: string) {
    await this.launchBrowser();

    const page = await this.browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      new Logger().error(`Error loading page: ${error.message}`);
    }

    try {
      const pdf = await page.pdf({ format: 'A4' });
      return pdf;
    } catch (error) {
      new Logger().error(`Error generating PDF: ${error.message}`);
    }
  }
}

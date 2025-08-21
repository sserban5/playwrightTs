import * as fs from 'fs';
import pdfParse from 'pdf-parse';
import { Page } from '@playwright/test';

export class PdfPage {
  constructor(private page: Page) {}

  async printPdfContent(filePath: string) {
    // Read and parse PDF from assets folder
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);

    // Print content to console
    console.log('PDF Content:', pdfData.text);

    return pdfData.text;
  }
}
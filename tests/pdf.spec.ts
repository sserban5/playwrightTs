import { test, expect } from '@playwright/test';
import { PdfPage } from '../pages/pdfPage';
import * as path from 'path';


test.describe('PDF Page Tests', () => {
    test.skip('Check PDF content from assets', async ({ page }) => {
        const pdfPage = new PdfPage(page);

        const filePath = path.join(__dirname, '../assets/fireSafetyReport.pdf');
        //const filePath = path.join(__dirname, '../assets/performanceReport.pdf'); 
        await pdfPage.printPdfContent(filePath);
    });

});
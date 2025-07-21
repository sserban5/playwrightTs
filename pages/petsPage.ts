import { Page, Locator, expect } from '@playwright/test';
import { URLs, getUrl } from '../config/urls';
import { LoginPage } from './loginPage';
import { tableCellClass } from '../config/textData';

export class PetsPage {
    readonly page: Page;
    readonly petsPagePaginator: Locator;
    readonly petsPagePaginatorOptionCount: Locator;
    readonly petsPageRowCount: Locator;

    constructor(page: Page) {
    this.page = page;
    
    this.petsPagePaginator = page.locator('mat-select');
    this.petsPagePaginatorOptionCount = page.locator('mat-option');
    this.petsPageRowCount = page.locator('tr#table__pet-row');

/*
id, check if it is = to index

check if one of the tags is the category, lower case
get the other one



*/
    }
    
async maxOptionLocator(optionIndex: number): Promise<Locator>{
    return this.page.locator(`mat-option:nth-of-type(${optionIndex})`);
}

async petsTableRowCells(rowIndex: number, classId: string): Promise<Locator> {
    return this.page.locator(`tr:nth-of-type(${rowIndex}) td.${classId}`)

}

    /*
navigate to pets, set the paginator to max,check if category is in tags and get the name, status, other tag
  */
  async petsTableCheck(): Promise<void> {
    const loginPage = new LoginPage(this.page);
    (await loginPage.checkLeftSideButtons('navigation__pets')).click();
    await this.page.waitForURL((url) => url.href.includes(getUrl(URLs.petsPage)), { timeout: 10000 });

    await this.page.waitForLoadState('domcontentloaded');
    await this.petsPagePaginator.click();
    const maxOptions = await this.petsPagePaginatorOptionCount.count();
    await (await this.maxOptionLocator(maxOptions)).click();


    const maxRows = await this.petsPageRowCount.count();
    for (let index = 1; index < maxRows; index++) {
         
        const currentId = await (await this.petsTableRowCells(index, tableCellClass[0])).innerText();
        const currentName = await (await this.petsTableRowCells(index, tableCellClass[1])).innerText();
        const currentCategory = await (await this.petsTableRowCells(index, tableCellClass[2])).innerText();
        const currentStatus = await (await this.petsTableRowCells(index, tableCellClass[3])).innerText();
        const currentTags = await (await this.petsTableRowCells(index, tableCellClass[4])).innerText();

        console.log(`currentId: ${currentId}, currentName: ${currentName}, currentCategory: ${currentCategory}, currentStatus: ${currentStatus}, currentTags: ${currentTags}`)
    }
  }
}
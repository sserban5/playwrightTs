import { Page, Locator, expect } from '@playwright/test';
import { URLs, getUrl } from '../config/urls';


export class TestPage {
    readonly page: Page;
    readonly countOfDragDrop: Locator; 
    readonly inputTestingParent: Locator;
    readonly inputTestingBar: Locator;
    readonly inputTestingGoButton: Locator;
    readonly inputTestingAlsoPetOwnerButton: Locator;


    constructor(page: Page) {
        this.page = page;

        this.countOfDragDrop = page.locator('div#dragdrop mat-card');

        this.inputTestingParent = page.locator('div#input');
        this.inputTestingBar = this.inputTestingParent.locator('input');
        this.inputTestingGoButton = this.inputTestingParent.locator('button#timeout-btn');
        this.inputTestingAlsoPetOwnerButton = this.inputTestingParent.locator('button#reset-btn');
    }


    async goto() {
        await this.page.goto(getUrl(URLs.testPage));  
    }

    async divDefinedWithId(divId: string): Promise<Locator>{
        return this.page.locator(`div#${divId}`);
    }

    async alignmentTesting(){
        //await this.divDefinedWithId('parent') resolves to a Locator. await (await this.divDefinedWithId('parent')).boundingBox() resolves to the BoundingBox
        const middleElmLocator = await this.divDefinedWithId('parent');
        await middleElmLocator.scrollIntoViewIfNeeded();
        const middleElm = await (await this.divDefinedWithId('parent')).boundingBox();
        const topElm = await (await this.divDefinedWithId('top-child')).boundingBox();
        const leftElm = await (await this.divDefinedWithId('left-child')).boundingBox();
        const rightElm = await (await this.divDefinedWithId('right-child')).boundingBox();
        const bottomElm = await (await this.divDefinedWithId('bottom-child')).boundingBox();
        
        
/*
To check the alignment of two elements in TypeScript with Playwright, compare their bounding box properties (e.g., x, y, width, height) using boundingBox():
expect(box1?.y).toBe(box2?.y);
x, y taken from the top left corner of the elm
*/      
        console.log(`middleElm?.x ${middleElm?.x}, middleElm?.y ${middleElm?.y}, middleElm?.width ${middleElm?.width}, middleElm?.height ${middleElm?.height},`);
        console.log(`topElm?.x ${topElm?.x}, topElm?.y ${topElm?.y}, topElm?.width ${topElm?.width}, topElm?.height ${topElm?.height},`);
        console.log(`leftElm?.x ${leftElm?.x}, leftElm?.y ${leftElm?.y}, leftElm?.width ${leftElm?.width}, leftElm?.height ${leftElm?.height},`);
        
        //toBeLessThan needs a valid number; undefined would cause an error. 
        // //toBe handles undefined gracefully, making ?? Infinity unnecessary.
        expect.soft(leftElm?.x, `Checking that the dogs are to the left of the cats.`).toBeLessThan(rightElm?.x ?? Infinity);
        expect.soft(leftElm?.y, `Checking that the dogs are in line with the cats.`).toBe(rightElm?.y);
       
        expect.soft(topElm?.x, `Checking that the elms are on the same column.`).toBe(bottomElm?.x);
        expect.soft(topElm?.y, `Checking that the elms are on diifferent rows.`).toBeLessThan(bottomElm?.y ?? Infinity);
       
        expect.soft(leftElm?.height, `Checking that the heights are the same.`).toBe(bottomElm?.height);
        expect.soft(topElm?.width, `Checking that the widths are the same.`).toBe(rightElm?.width);


    }

    async checkOrderOfDragDrop(){
        const texts: string[] = [];
        const nrOfDragDrop = this.countOfDragDrop.count();
        for (let index = 1; index < await nrOfDragDrop +1; index++) {
            const currentText = await this.page.locator(`div#dragdrop mat-card:nth-of-type(${index})`).innerText();
            texts.push(currentText.trim());
        }
        console.log(`List is ${texts}`);
        return texts;
    }

    async dragDropTesting(){
        const beforeReorder = this.checkOrderOfDragDrop();

        const secondLocator = this.page.locator(`div#dragdrop mat-card:nth-of-type(2)`);
        const fourthLocator = this.page.locator(`div#dragdrop mat-card:nth-of-type(4)`);
        
        /*
        await secondLocator.scrollIntoViewIfNeeded();
        await secondLocator.dragTo(fourthLocator);
         */      

        await secondLocator.scrollIntoViewIfNeeded();
        await expect(secondLocator).toBeVisible();
        await expect(fourthLocator).toBeVisible();

        const secondBox = await secondLocator.boundingBox();
        const fourthBox = await fourthLocator.boundingBox();

        if (secondBox && fourthBox) {
            await secondLocator.hover();
            await this.page.mouse.down();
            await fourthLocator.hover();
            await fourthLocator.hover(); // Ensure dragover fires
            await this.page.mouse.up();
            await this.page.waitForTimeout(1000); // Wait for UI update
        }

        const afterReorder = await this.checkOrderOfDragDrop();
        expect(beforeReorder,`Checking that the list was reordered.`).not.toEqual(afterReorder);
    }


    async alertInput(petName: string){

        await this.inputTestingBar.scrollIntoViewIfNeeded();
        await this.inputTestingBar.fill(petName);
        await this.inputTestingGoButton.click();

        await this.handleAlert('accept')

    }

    async handleAlert(action: 'accept' | 'dismiss', message?: string): Promise<void> {
        this.page.on('dialog', async dialog => {
            if (action === 'accept') {
                if (message && dialog.type() === 'prompt') {
                    await dialog.accept(message);
                } else {
                    await dialog.accept();
                }
            } else {
                await dialog.dismiss();
            }
        });
    }




}

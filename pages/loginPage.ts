import { Page, Locator, expect } from '@playwright/test';
import { URLs, getUrl } from '../config/urls';
import { Credentials, getCredentials } from '../config/credentials';
import { buttonIds } from '../config/textData';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBar: Locator;

  readonly loginFrame: Locator;
  readonly parentParamLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[type=text]');
    this.passwordInput = page.locator('input[type=password]');
    this.loginButton = page.locator('button#login__submit');
    this.errorBar = page.locator('snack-bar-container');
    
    //the parent
    this.loginFrame = page.locator('form');
    //checking for the parent-child relationship
    this.parentParamLoginButton = this.loginFrame.locator('button');
  }

    //checking parent-child relationship + params
  async getInputField(inputType: string): Promise<Locator> {
    return this.loginFrame.locator(`input[type="${inputType}"]`);
  }

  async checkLeftSideButtons(buttonId: string): Promise<Locator>{
    return this.page.locator(`button#${buttonId}`);
  }

  async goto() {
    await this.page.goto(getUrl(URLs.loginPage));  
  }

  /*
  simple login
  */
  async login(role: string = 'demoUser') {     // if no role is provided user is taken
    const { username, password } = getCredentials(role); // Get credentials by role
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /* 
  same as above just checking that the parameterized locators work
  */
  async loginWithParentAndParams(role: string = 'demoUser') {     // if no role is provided user is taken
    const { username, password } = getCredentials(role); // Get credentials by role
    await (await this.getInputField('text')).fill(username);
    await (await this.getInputField('password')).fill(password);
    await this.parentParamLoginButton.click();
  }

  /*
  checking what shows up first, error message or the url changes
  */
  async waitForErrorBarOrHomeUrl(timeout = 30000) {
    let isErrorBarVisible = false;
    let isHomeUrl = false;
    const start = Date.now();
    while (Date.now() - start < timeout) {
      isErrorBarVisible = await this.errorBar.isVisible();
      const url = this.page.url();
      isHomeUrl = url.includes(getUrl(URLs.homePage));
      if (isErrorBarVisible) return { condition: 'errorBarVisible', value: true };
      if (isHomeUrl) return { condition: 'homeUrl', value: true };
      await this.page.waitForTimeout(500); // Wait 500ms before next check
    }
    return { condition: 'none', value: false };
  }

  /*
checking the top right buttons from the homepage
  */
  async checkButtonVisibility(): Promise<void>{
    await this.page.waitForLoadState('domcontentloaded');
    for (const id of buttonIds) {
      const currentButton = await this.checkLeftSideButtons(id);
      await expect.soft(currentButton).toBeVisible();
    }
  }
  
}
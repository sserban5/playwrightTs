import { Page, Locator } from '@playwright/test';
import { URLs, getUrl } from '../config/urls';
import { Credentials, getCredentials } from '../config/credentials';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBar: Locator

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[type=text]');
    this.passwordInput = page.locator('input[type=password]');
    this.loginButton = page.locator('button#login__submit');
    this.errorBar = page.locator('snack-bar-container');
  }

  async goto() {
    await this.page.goto(getUrl(URLs.loginPage)); // Use URL from config
  }

  async login(role: string = 'demoUser') {     // if no role is provided user is taken
    const { username, password } = getCredentials(role); // Get credentials by role
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async waitForErrorBarOrHomeUrl(timeout = 30000) {
    let isErrorBarVisible = false;
    let isHomeUrl = false;
    const start = Date.now();
    while (Date.now() - start < timeout) {
      isErrorBarVisible = await this.errorBar.isVisible();
      const url = await this.page.url();
      isHomeUrl = url.includes(getUrl(URLs.homePage));
      if (isErrorBarVisible) return { condition: 'errorBarVisible', value: true };
      if (isHomeUrl) return { condition: 'homeUrl', value: true };
      await this.page.waitForTimeout(500); // Wait 500ms before next check
    }
    return { condition: 'none', value: false };
  }




}
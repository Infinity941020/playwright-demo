import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';

// ログイン画面の入力欄・ボタンへの操作と、画面の表示の確認をまとめる。
// 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示の確認も呼ぶ
export class LoginPage {

  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessageLocator: Locator;

  constructor(page: Page) {

    this.page = page;

    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto(urls.login);
  }

  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  // ユーザー名とパスワードを入力して、ログインボタンを押す（空の文字を渡すと、その欄は空欄のまま）
  async login(username: string, password: string) {

    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // エラーの文言が、渡した文言と一字一句同じであることを確かめる
  async expectErrorMessage(message: string) {
    await expect(this.errorMessageLocator).toHaveText(message);
  }

  async expectUsernameValue(username: string) {
    await expect(this.usernameInput).toHaveValue(username);
  }

  // ログイン画面が表示されていることを確かめる（URL が完全に一致し、入力欄とボタンが見えている）
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.login);
    await expect(this.loginButton).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }
}

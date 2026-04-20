import { Page } from '@playwright/test';

// ログイン画面操作専用クラス
export class LoginPage {

  // Playwrightのpage情報を受け取る
  constructor(private page: Page) {}

  // ログイン画面URLへアクセス
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // ユーザー名入力欄へ文字入力
  async enterUsername(username: string) {
    await this.page.fill('#user-name', username);
  }

  // パスワード入力欄へ文字入力
  async enterPassword(password: string) {
    await this.page.fill('#password', password);
  }

  // ログインボタン押下
  async clickLogin() {
    await this.page.click('#login-button');
  }

  // ログイン操作をまとめて実行
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // エラーメッセージ要素を取得
  errorMessage() {
    return this.page.locator('[data-test="error"]');
  }
}
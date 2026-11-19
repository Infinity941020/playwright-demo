// PlaywrightのPage型・Locator型・expectを使用するためのインポート
import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';

/*
================================
ログイン画面のUI操作（Page Object）
責務：
- 要素取得
- 単体操作
- 画面レベルの検証
================================
*/
export class LoginPage {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ 入力フィールド（ユーザー名）
  // ================================
  readonly usernameInput: Locator;

  // ================================
  // ■ 入力フィールド（パスワード）
  // ================================
  readonly passwordInput: Locator;

  // ================================
  // ■ ログインボタン
  // ================================
  readonly loginButton: Locator;

  // ================================
  // ■ エラーメッセージ表示エリア
  // ================================
  readonly errorMessageLocator: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  // ================================
  // ログイン画面へ遷移
  // （表示の確認は、呼び出す側で expectOnPage() を呼んで行う）
  // ================================
  async goto() {

    await this.page.goto(urls.login);
  }

  // ================================
  // ユーザー名入力
  // ================================
  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  // ================================
  // パスワード入力
  // ================================
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  // ================================
  // ログインボタン押下
  // ================================
  async clickLogin() {
    await this.loginButton.click();
  }

  // ================================
  // ログイン実行（業務単位）
  // ================================
  async login(username: string, password: string) {

    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // ================================
  // エラー表示検証
  // ================================
  async expectErrorVisible() {

    await expect(this.errorMessageLocator).toBeVisible();
  }

  // ================================
  // ログイン画面表示確認
  // ================================
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.login);
    await expect(this.loginButton).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }
}

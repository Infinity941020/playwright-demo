// PlaywrightのPage型・Locator型・expectを使用するためのインポート
import { Page, Locator, expect } from '@playwright/test';

// ログイン画面のUI操作（要素取得と単体操作）をまとめたPage Object
export class LoginPage {

  // Playwrightのページインスタンスを保持するプロパティ
  readonly page: Page;

  // ユーザー名入力欄のLocator
  readonly usernameInput: Locator;

  // パスワード入力欄のLocator
  readonly passwordInput: Locator;

  // ログインボタンのLocator
  readonly loginButton: Locator;

  // エラーメッセージ表示エリアのLocator
  readonly errorMessageLocator: Locator;

  /*
  ================================
  コンストラクタ
  ================================
  */
  constructor(page: Page) {

    // pageインスタンス保持
    this.page = page;

    // ユーザー名入力欄
    this.usernameInput = page.locator('#user-name');

    // パスワード入力欄
    this.passwordInput = page.locator('#password');

    // ログインボタン
    this.loginButton = page.locator('#login-button');

    // エラーメッセージ
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  /*
  ================================
  ログイン画面へ遷移
  ================================
  */
  async goto() {

    // ログイン画面へアクセス
    await this.page.goto('https://www.saucedemo.com/');

    // ログインボタン表示確認
    await expect(this.loginButton).toBeVisible();
  }

  /*
  ================================
  ユーザー名入力
  ================================
  */
  async enterUsername(username: string) {

    // ユーザー名入力
    await this.usernameInput.fill(username);
  }

  /*
  ================================
  パスワード入力
  ================================
  */
  async enterPassword(password: string) {

    // パスワード入力
    await this.passwordInput.fill(password);
  }

  /*
  ================================
  ログインボタン押下
  ================================
  */
  async clickLogin() {

    // ログインボタン押下
    await this.loginButton.click();
  }

  /*
  ================================
  ログイン実行
  ================================
  */
  async login(username: string, password: string) {

    // ユーザー名入力
    await this.enterUsername(username);

    // パスワード入力
    await this.enterPassword(password);

    // ログイン押下
    await this.clickLogin();
  }

  /*
  ================================
  エラーメッセージ取得
  ================================
  */
  getErrorMessage(): Locator {

    return this.errorMessageLocator;
  }

  /*
  ================================
  ログイン画面表示確認
  Logout着地確認対応
  ================================
  */
  async expectOnLoginPage() {

    // URL確認
    await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);

    // ログインボタン表示確認
    await expect(this.loginButton).toBeVisible();

    // 入力欄表示確認
    await expect(this.usernameInput).toBeVisible();

    await expect(this.passwordInput).toBeVisible();
  }
}
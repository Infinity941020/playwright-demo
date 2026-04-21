// PlaywrightのPage型・Locator型・expectを使用するためのimport
import { Page, Locator, expect } from '@playwright/test';

// ログイン画面の操作をまとめたPage Objectクラス
export class LoginPage {

  // Playwrightのページインスタンスを保持
  readonly page: Page;

  // ユーザー名入力欄
  readonly usernameInput: Locator;

  // パスワード入力欄
  readonly passwordInput: Locator;

  // ログインボタン
  readonly loginButton: Locator;

  // エラーメッセージ表示欄
  readonly errorMessageLocator: Locator;

  // コンストラクタ（page受け取り＋Locator初期化）
  constructor(page: Page) {

    // pageをクラス内で使えるよう保持
    this.page = page;

    // ユーザー名入力欄を取得
    this.usernameInput = page.locator('#user-name');

    // パスワード入力欄を取得
    this.passwordInput = page.locator('#password');

    // ログインボタンを取得
    this.loginButton = page.locator('#login-button');

    // エラーメッセージ欄を取得
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  // ログイン画面へ遷移
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // ユーザー名を入力
  async enterUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  // パスワードを入力
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  // ログインボタンをクリック
  async clickLogin() {
    await this.loginButton.click();
  }

  // ログイン処理をまとめて実行
  async login(username: string, password: string) {

    // ユーザー名入力
    await this.enterUsername(username);

    // パスワード入力
    await this.enterPassword(password);

    // ログインボタン押下
    await this.clickLogin();
  }

  // エラーメッセージLocatorを取得（新メソッド名）
  getErrorMessage(): Locator {
    return this.errorMessageLocator;
  }

  // 旧テストコード互換用メソッド（errorMessage()でも使えるようにする）
  errorMessage(): Locator {
    return this.errorMessageLocator;
  }

  // エラーメッセージが表示されていることを確認
  async expectErrorVisible() {
    await expect(this.errorMessageLocator).toBeVisible();
  }
}
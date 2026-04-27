// PlaywrightのPage型・Locator型を使用するためのインポート
import { Page, Locator } from '@playwright/test';

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

  // コンストラクタ（pageを受け取りLocatorを初期化）
  constructor(page: Page) {

    // pageインスタンスをクラス内で使用できるよう保持
    this.page = page;

    // ユーザー名入力欄の要素を取得（id指定）
    this.usernameInput = page.locator('#user-name');

    // パスワード入力欄の要素を取得（id指定）
    this.passwordInput = page.locator('#password');

    // ログインボタンの要素を取得（id指定）
    this.loginButton = page.locator('#login-button');

    // エラーメッセージ要素を取得（data-test属性指定）
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  // ログイン画面へ遷移する処理
  async goto() {

    // ログインページURLへアクセス
    await this.page.goto('https://www.saucedemo.com/');
  }

  // ユーザー名を入力する処理
  async enterUsername(username: string) {

    // ユーザー名入力欄へ文字を入力
    await this.usernameInput.fill(username);
  }

  // パスワードを入力する処理
  async enterPassword(password: string) {

    // パスワード入力欄へ文字を入力
    await this.passwordInput.fill(password);
  }

  // ログインボタンをクリックする処理
  async clickLogin() {

    // ログインボタンをクリック
    await this.loginButton.click();
  }

  // ログイン操作（入力＋クリックの操作のみをまとめた処理）
  async login(username: string, password: string) {

    // ユーザー名を入力
    await this.enterUsername(username);

    // パスワードを入力
    await this.enterPassword(password);

    // ログインボタンをクリック
    await this.clickLogin();
  }

  // エラーメッセージLocatorを取得する処理（テスト側でassertするため）
  getErrorMessage(): Locator {

    // エラーメッセージ要素を返す
    return this.errorMessageLocator;
  }
}
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// ログインの操作と、その結果の確認を、利用者の操作の単位でまとめる。
// テストから画面の細かい操作を直接扱わずに済むようにする
export class LoginFlow {

  private readonly loginPage: LoginPage;

  // ログインに成功した後に移る、商品一覧画面の表示を確かめるために使う
  private readonly inventoryPage: InventoryPage;

  constructor(page: Page) {

    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  async login(username: string, password: string) {

    await this.loginPage.goto();

    // 画面が開けていないことを、ログインの失敗と取り違えないように、先に表示を確かめる
    await this.loginPage.expectOnPage();

    await this.loginPage.login(username, password);
  }

  async expectLoginErrorMessage(message: string) {
    await this.loginPage.expectErrorMessage(message);
  }

  // ログインに失敗した後も、ユーザー名の入力値が残っていることを確かめる
  async expectUsernameRetained(username: string) {
    await this.loginPage.expectUsernameValue(username);
  }

  // ログインに成功し、商品一覧画面へ移っていることを確かめる
  async expectLoginSuccess() {
    await this.inventoryPage.expectOnPage();
  }

  async expectOnLoginPage() {
    await this.loginPage.expectOnPage();
  }

  async expectNoLoginError() {
    await this.loginPage.expectNoError();
  }

  async expectLoginInputsEmpty() {
    await this.loginPage.expectInputsEmpty();
  }
}

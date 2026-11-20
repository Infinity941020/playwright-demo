import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// ログインの操作と、その結果の確認を、利用者の操作の単位でまとめる。
// テストから画面の細かい操作を直接扱わずに済むようにする
export class LoginFlow {

  private loginPage: LoginPage;

  // ログインに成功した後に移る、商品一覧画面の表示を確かめるために使う
  private inventoryPage: InventoryPage;

  constructor(page: Page) {

    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
  }

  // ログイン画面を開いて表示を確かめてから、ログインする
  async login(username: string, password: string) {

    await this.loginPage.goto();
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
}

// LoginPage（UI操作クラス）を利用するためのインポート
import { LoginPage } from '../pages/LoginPage';

// PlaywrightのPage型を使用するためのインポート
import { Page } from '@playwright/test';

/*
================================
LoginFlow（最終統一版）
責務：
- 業務単位の操作のみ提供
- specからUI詳細を隠蔽
- LoginPage依存をFlowで吸収
================================
*/

export class LoginFlow {

  private loginPage: LoginPage;

  constructor(page: Page) {

    this.loginPage = new LoginPage(page);
  }

  /*
  ================================
  ■ 業務操作
  ================================
  */
  async login(username: string, password: string) {

    await this.loginPage.goto();
    await this.loginPage.login(username, password);
  }

  /*
  ================================
  ■ 検証
  ================================
  */

  async expectLoginError() {

    await this.loginPage.expectErrorVisible();
  }

  async expectLoginSuccess() {

    await this.loginPage.expectOnInventoryPage();
  }

  async expectOnLoginPage() {

    await this.loginPage.expectOnLoginPage();
  }

  /*
  ================================
  ■ 互換用（旧spec対応）
  ================================
  */
  getPage(): LoginPage {

    return this.loginPage;
  }
}
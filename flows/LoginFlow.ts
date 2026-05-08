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

  // LoginPageインスタンス（UI操作担当）
  private loginPage: LoginPage;

  /*
  ================================
  コンストラクタ
  ================================
  */

  constructor(page: Page) {

    this.loginPage = new LoginPage(page);
  }

  /*
  ================================
  ■ 業務操作
  ================================
  */

  // ログイン実行（業務操作）
  async login(username: string, password: string) {

    await this.loginPage.goto();
    await this.loginPage.login(username, password);
  }

  /*
  ================================
  ■ 検証（業務レベル）
  ================================
  */

  // ログイン失敗検証
  async expectLoginError() {

    await this.loginPage.expectErrorVisible();
  }

  // ログイン成功検証
  async expectLoginSuccess() {

    await this.loginPage.expectOnInventoryPage();
  }

  // ログイン画面表示確認
  async expectOnLoginPage() {

    await this.loginPage.expectOnLoginPage();
  }
}
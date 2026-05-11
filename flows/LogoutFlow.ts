// PlaywrightのPage型を使用
import { Page } from '@playwright/test';

// 各Page Object
import { LoginPage } from '../pages/LoginPage';
import { MenuPage } from '../pages/MenuPage';

/*
================================
LogoutFlow
ログアウト機能用 Flow
================================
*/
export class LogoutFlow {

  // LoginPageインスタンス（ログイン画面操作を担当）
  private login: LoginPage;

  // MenuPageインスタンス（サイドメニュー操作を担当）
  private menu: MenuPage;

  /*
  ================================
  コンストラクタ
  ================================
  */

  // Pageインスタンスを受け取り各PageObjectを初期化
  constructor(page: Page) {

    // LoginPage初期化
    this.login = new LoginPage(page);

    // MenuPage初期化
    this.menu = new MenuPage(page);
  }

  /*
  ================================
  ログアウト実行
  ================================
  */
  async logout() {

    // メニューを開く
    await this.menu.openMenu();

    // Logout押下
    await this.menu.logout();

    // ログイン画面へ戻ったこと確認
    await this.login.expectOnLoginPage();
  }

  /*
  ================================
  ログイン画面確認
  ================================
  */
  async expectOnLoginPage() {

    // ログイン画面表示確認
    await this.login.expectOnLoginPage();
  }
}
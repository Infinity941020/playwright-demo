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

  // ログイン画面
  private login: LoginPage;

  // サイドメニュー
  private menu: MenuPage;

  /*
  ================================
  コンストラクタ
  ================================
  */
  constructor(page: Page) {

    // 各Page Object初期化
    this.login = new LoginPage(page);
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

    await this.login.expectOnLoginPage();
  }
}
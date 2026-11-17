// PlaywrightのPage型・Locator型・expectを使用
import { Page, Locator, expect } from '@playwright/test';

/*
================================
MenuPage
サイドメニュー操作用 Page Object
================================
*/
export class MenuPage {

  // Playwrightページ保持
  readonly page: Page;

  // ハンバーガーメニューボタン
  readonly menuButton: Locator;

  // Logoutリンク
  readonly logoutLink: Locator;

  /*
  ================================
  コンストラクタ
  ================================
  */

  // Pageインスタンスを受け取りLocatorを初期化
  constructor(page: Page) {

    // Playwright Page保持
    this.page = page;

    // ハンバーガーメニューボタン取得
    this.menuButton = page.locator('#react-burger-menu-btn');

    // Logoutリンク取得
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /*
  ================================
  メニューを開く
  ================================
  */
  async openMenu() {

    // メニューボタン表示確認
    await expect(this.menuButton).toBeVisible();

    // メニュー押下
    await this.menuButton.click();

    // Logoutリンク表示確認
    await expect(this.logoutLink).toBeVisible();
  }

  /*
  ================================
  Logout実行
  ================================
  */
  async logout() {

    // メニュー未展開時は開く
    if (!(await this.logoutLink.isVisible())) {

      await this.openMenu();
    }

    // Logoutリンク押下
    await this.logoutLink.click();

    // ログイン画面へ戻ったこと確認
    await expect(this.page).toHaveURL(
      'https://www.saucedemo.com/'
    );
  }

  /*
  ================================
  メニュー表示確認
  ================================
  */
  async expectMenuOpened() {

    // Logoutリンク表示確認
    await expect(this.logoutLink).toBeVisible();
  }
}
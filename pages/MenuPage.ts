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
  constructor(page: Page) {

    // page保持
    this.page = page;

    // メニューボタン
    this.menuButton = page.locator('#react-burger-menu-btn');

    // Logoutリンク
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

    // メニュー開いていなければ開く
    if (!(await this.logoutLink.isVisible())) {
      await this.openMenu();
    }

    // Logoutリンク押下
    await this.logoutLink.click();
  }

  /*
  ================================
  メニュー表示確認
  ================================
  */
  async expectMenuOpened() {

    await expect(this.logoutLink).toBeVisible();
  }
}
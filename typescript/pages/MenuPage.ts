// PlaywrightのPage型・Locator型・expectを使用
import { Page, Locator, expect } from '@playwright/test';

/*
================================
MenuPage
サイドメニュー操作用 Page Object
================================
メニューの開閉は、メニュー領域の aria-hidden 属性で判定する（開いているとき "false"。decisions.md 論点17）。
URL で開いた直後は、閉じているメニューの項目も「表示されている」と判定されるため、
表示の有無では開閉を判定できない。
*/
export class MenuPage {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ ハンバーガーメニューボタン
  // ================================
  // 開閉ボタン自体には data-test がないため、id で特定する
  readonly menuButton: Locator;

  // ================================
  // ■ メニュー領域
  // ================================
  // メニュー領域には id・data-test がないため、CSS クラスで特定する
  readonly menuArea: Locator;

  // ================================
  // ■ Logoutリンク
  // ================================
  readonly logoutLink: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.menuButton = page.locator('#react-burger-menu-btn');
    this.menuArea = page.locator('.bm-menu-wrap');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  /*
  ================================
  メニューを開く
  ================================
  */
  async openMenu() {

    // メニュー押下
    await this.menuButton.click();

    // メニューが開いたことを確認
    await this.expectMenuOpened();
  }

  /*
  ================================
  Logoutリンク押下
  （ログイン画面の表示を確かめるときは、呼び出す側で表示を確かめる処理も呼ぶ）
  ================================
  */
  async logout() {

    await this.logoutLink.click();
  }

  /*
  ================================
  メニューが開いていることの確認
  ================================
  */
  async expectMenuOpened() {

    await expect(this.menuArea).toHaveAttribute('aria-hidden', 'false');
  }
}

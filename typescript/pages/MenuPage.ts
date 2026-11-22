import { Page, Locator, expect } from '@playwright/test';

// 左上のメニューの操作と、メニューの開閉・項目の確認をまとめる。
// - URL で開いた直後は、メニューが閉じる動きが終わるまで、閉じている項目も表示されていると判定されるため、
//   開閉はメニュー領域の aria-hidden 属性で判定する（python/decisions.md の論点17）
// - 項目を押す操作は、メニューが開いている前提で押す（開いていないと押せない）
export class MenuPage {

  private readonly page: Page;
  private readonly menuButton: Locator;
  private readonly closeButton: Locator;
  private readonly menuArea: Locator;
  private readonly menuItems: Locator;
  private readonly allItemsLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {

    this.page = page;

    // 開くボタンと閉じるボタンにはテスト用の属性がないため、要素の id で探す
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeButton = page.locator('#react-burger-cross-btn');

    // メニュー領域には id もテスト用の属性もないため、見た目の指定に使う名前で探す
    this.menuArea = page.locator('.bm-menu-wrap');

    // Dynamic Catalog を開くと出る子の項目を含めないように、テスト用の属性の値が「-sidebar-link」で終わる項目だけを探す
    this.menuItems = page.locator('[data-test$="-sidebar-link"]');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  // 画面を開いた直後の、メニューが閉じる動きの間に開くと、開いた扱いなのに項目が隠れたままになるため、閉じたメニューの項目が見えなくなるまで待つ。
  // メニューが閉じている前提で呼ぶ（開いたままだと、待ちが時間切れになる）
  async waitUntilMenuClosed() {
    await expect(this.menuItems.first()).toBeHidden();
  }

  async clickMenuButton() {
    await this.menuButton.click();
  }

  async clickCloseButton() {
    await this.closeButton.click();
  }

  async pressEscape() {
    await this.page.keyboard.press('Escape');
  }

  async clickAllItems() {
    await this.allItemsLink.click();
  }

  async clickLogout() {
    await this.logoutLink.click();
  }

  async expectMenuOpened() {

    await expect(this.menuArea).toHaveAttribute('aria-hidden', 'false');

    // 開いた扱いでも項目が隠れたままのことがあるため、最初の項目が見えることも確かめる
    await expect(this.menuItems.first(), 'メニューは開いた扱いだが項目が表示されない（logout_spec.md の判断できない挙動）').toBeVisible();
  }

  async expectMenuClosed() {
    await expect(this.menuArea).toHaveAttribute('aria-hidden', 'true');
  }

  // メニューの項目が、仕様書の並び順のとおりに並び、すべて見えていることを確かめる
  async expectMenuItems() {

    await expect(this.menuItems).toHaveText(['All Items', 'Dynamic Catalog', 'About', 'Logout', 'Reset App State']);

    for (const item of await this.menuItems.all()) {
      await expect(item).toBeVisible();
    }
  }
}

// PlaywrightのPage型・Locator型・expectを使用
import { Page, Locator, expect } from '@playwright/test';

/*
================================
HeaderComponent
ヘッダー共通操作・検証Component
================================
*/
export class HeaderComponent {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ カートバッジ
  // ================================
  readonly cartBadge: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /*
  ================================
  カートバッジ件数確認
  ================================
  */
  async expectBadgeCount(count: number) {

    // 0件時は非表示確認
    if (count === 0) {

      await expect(this.cartBadge).toHaveCount(0);

    } else {

      // 件数表示確認
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }
}

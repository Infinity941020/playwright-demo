// PlaywrightのPage型・expectを使用
import { Page, expect } from '@playwright/test';

/*
================================
HeaderComponent
ヘッダー共通操作・検証Component
================================
*/
export class HeaderComponent {

  // Playwright Page保持
  private page: Page;

  /*
  ================================
  コンストラクタ
  ================================
  */

  // Pageインスタンスを受け取り保持
  constructor(page: Page) {

    // Playwright Page保持
    this.page = page;
  }

  /*
  ================================
  カートバッジ件数確認
  ================================
  */
  async expectBadgeCount(count: number) {

    // カートバッジ取得
    const badge = this.page.locator('.shopping_cart_badge');

    // 0件時は非表示確認
    if (count === 0) {

      await expect(badge).toHaveCount(0);

    } else {

      // 件数表示確認
      await expect(badge).toHaveText(String(count));
    }
  }
}
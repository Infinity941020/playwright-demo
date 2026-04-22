// Playwrightのexpectを使用
import { Page, expect } from '@playwright/test';

/*
================================
ヘッダーコンポーネント
================================
カートバッジなど画面共通要素を管理
================================
*/

export class HeaderComponent {
  constructor(private page: Page) {}

  // バッジ件数確認
  async expectBadgeCount(count: number) {
    await expect(this.page.locator('.shopping_cart_badge'))
      .toHaveText(String(count));
  }

  // バッジ非表示確認
  async expectNoBadge() {
    await expect(this.page.locator('.shopping_cart_badge'))
      .toHaveCount(0);
  }
}
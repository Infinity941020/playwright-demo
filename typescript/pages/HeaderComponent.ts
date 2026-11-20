import { Page, Locator, expect } from '@playwright/test';

// 各画面に共通のヘッダーにある、カートアイコンへの操作と、カートのバッジの確認をまとめる
export class HeaderComponent {

  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {

    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async clickCartIcon() {
    await this.cartLink.click();
  }

  // 0件のときは、バッジの要素そのものが画面にないことを確かめる
  async expectBadgeCount(count: number) {

    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }
}

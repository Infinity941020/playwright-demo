import { Page, expect } from '@playwright/test';

export class HeaderComponent {
  constructor(private page: Page) {}

  async expectBadgeCount(count: number) {
    const badge = this.page.locator('.shopping_cart_badge');

    if (count === 0) {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(String(count));
    }
  }
}
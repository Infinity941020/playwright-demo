import { Page, expect } from '@playwright/test';

/*
========================================
CartPage（完全リファクタ版）
========================================
*/

export class CartPage {
  constructor(private page: Page) {}

  // ================================
  // 商品追加系
  // ================================

  // 先頭の商品を追加
  async addFirstItem() {
    await this.page.locator('[data-test^="add-to-cart"]').first().click();
  }

  // 全商品を追加（安定版）
  async addAllItems() {
    const buttons = this.page.locator('[data-test^="add-to-cart"]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }

    return count;
  }

  // ================================
  // カート操作
  // ================================

  async goToCart() {
    await this.page.click('.shopping_cart_link');
  }

  async removeFirstItem() {
    await this.page.locator('button', { hasText: 'Remove' }).first().click();
  }

  async removeAllItems() {
    const buttons = this.page.locator('button', { hasText: 'Remove' });
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      await buttons.first().click();
    }
  }

  // ================================
  // 状態確認
  // ================================

  async expectBadgeCount(expected: number) {
    const badge = this.page.locator('.shopping_cart_badge');

    if (expected === 0) {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(String(expected));
    }
  }

  async expectCartCount(expected: number) {
    await expect(this.page.locator('.cart_item')).toHaveCount(expected);
  }

  // ================================
  // 安定化（重要）
  // ================================

  async scrollToTop() {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  async waitForInventory() {
    await this.page.waitForSelector('.inventory_list');
  }
}
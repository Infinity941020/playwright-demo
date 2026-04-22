import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await expect(this.page.locator('.inventory_list')).toBeVisible();
  }

  async addFirstItem() {
    const btn = this.page.locator('[data-test^="add-to-cart"]').first();
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async addAllItems(): Promise<number> {
    const buttons = this.page.locator('[data-test^="add-to-cart"]');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }

    return count;
  }
}
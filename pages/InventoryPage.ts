// Playwright Page型を使用
import { Page, expect } from '@playwright/test';

/*
================================
InventoryPage（最終確定版）
================================
責務：
- 商品一覧ページの操作のみ
- 商品追加操作
================================
*/

export class InventoryPage {
  constructor(private page: Page) {}

  /*
  ================================
  ① 商品一覧へ遷移
  ================================
  */
  async goto() {

    await this.page.goto('https://www.saucedemo.com/inventory.html');

    // 商品一覧表示の安定待ち
    await expect(this.page.locator('.inventory_list')).toBeVisible();
  }

  /*
  ================================
  ② 先頭商品を追加
  ================================
  */
  async addFirstItem() {

    const button = this.page.locator('.inventory_item button').first();

    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await button.click();
  }

  /*
  ================================
  ③ 全商品を追加
  ================================
  */
  async addAllItems(): Promise<number> {

    const buttons = this.page.locator('.inventory_item button');

    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);

      await expect(btn).toBeVisible();
      await btn.click();
    }

    return count;
  }

  /*
  ================================
  ④ 商品件数取得（補助）
  ================================
  */
  async getItemCount(): Promise<number> {
    return await this.page.locator('.inventory_item').count();
  }
}
import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  /*
  ================================
  商品一覧画面へ遷移
  ================================
  */
  async goto() {
    // 商品一覧ページへ遷移
    await this.page.goto('https://www.saucedemo.com/inventory.html');

    // ページ表示保証（URLチェック）
    await expect(this.page).toHaveURL(/inventory/);

    // 商品ボタンが描画されていることを保証
    await expect(this.page.locator('[data-test^="add-to-cart"]').first())
      .toBeVisible();
  }

  /*
  ================================
  全商品をカートに追加（安定版）
  ================================
  */
  async addAllItems() {

  // addボタン一覧取得
  const buttons = this.page.locator('[data-test^="add-to-cart"]');

  // 表示待機
  await expect(buttons.first()).toBeVisible();

  // 件数取得
  const count = await buttons.count();

  // 毎回先頭を押す（押した要素はremove化して消える）
  for (let i = 0; i < count; i++) {

    // 先頭ボタン押下
    await buttons.first().click();
  }

  return count;
}

  /*
  ================================
  1件追加
  ================================
  */
  async addFirstItem() {
    // 最初の追加ボタンをクリック
    await this.page.locator('[data-test^="add-to-cart"]').first().click();
  }
}
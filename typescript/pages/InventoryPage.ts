// PlaywrightのPage型・expectを使用
import { Page, expect } from '@playwright/test';

/*
================================
InventoryPage
商品一覧画面操作用 Page Object
================================
*/
export class InventoryPage {

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
  商品一覧画面表示確認
  ================================
  */
  async goto() {

    // inventory画面URL確認
    await expect(this.page).toHaveURL(/inventory/);

    // 商品追加ボタン表示確認
    await expect(
      this.page.locator('[data-test^="add-to-cart"]').first()
    ).toBeVisible();
  }

  /*
  ================================
  全商品をカートに追加（安定版）
  ================================
  */
  async addAllItems() {

    // add-to-cartボタン一覧取得
    const buttons = this.page.locator(
      '[data-test^="add-to-cart"]'
    );

    // ボタン表示待機
    await expect(buttons.first()).toBeVisible();

    // ボタン件数取得
    const count = await buttons.count();

    // 先頭ボタンを順番に押下
    // 押下後はremoveへ変化するためfirst固定
    for (let i = 0; i < count; i++) {

      // 先頭ボタン押下
      await buttons.first().click();
    }

    // 追加件数返却
    return count;
  }

  /*
  ================================
  商品を1件追加
  ================================
  */
  async addFirstItem() {

    // 最初の商品追加ボタン表示確認
    await expect(
      this.page.locator('[data-test^="add-to-cart"]').first()
    ).toBeVisible();

    // 最初の商品追加ボタン押下
    await this.page
      .locator('[data-test^="add-to-cart"]')
      .first()
      .click();
  }
}
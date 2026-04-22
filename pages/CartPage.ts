// Playwright機能（Page / expect）を使用するためimport
import { Page, expect } from '@playwright/test';

// URL定数を使用するためimport
import { urls } from '../utils/urls';

// カート画面操作用クラスを定義する
export class CartPage {

  // Pageオブジェクトを受け取る
  constructor(private page: Page) {}

  // 商品一覧画面へ遷移する
  async gotoInventory() {
    await this.page.goto(urls.inventory);

    // 商品一覧が表示されるまで待機する
    await expect(this.page.locator('.inventory_list')).toBeVisible();
  }

  // 先頭商品を1件追加する
  async addFirstItem() {

    // 追加ボタンが表示されるまで待機する
    await expect(
      this.page.locator('[data-test^="add-to-cart"]').first()
    ).toBeVisible();

    // 先頭商品の追加ボタンを押下する
    await this.page.locator('[data-test^="add-to-cart"]').first().click();
  }

  // 全商品を追加する
  async addAllItems() {

    // 追加ボタン一覧を取得する
    const buttons = this.page.locator('[data-test^="add-to-cart"]');

    // 商品件数を取得する
    const count = await buttons.count();

    // 全件分追加ボタンを押下する
    for (let i = 0; i < count; i++) {
      await buttons.nth(0).click();
    }

    // 追加件数を返却する
    return count;
  }

  // カート画面へ遷移する
  async goToCart() {

    // カートアイコンが表示されるまで待機する
    await expect(this.page.locator('.shopping_cart_link')).toBeVisible();

    // カートアイコンを押下する
    await this.page.locator('.shopping_cart_link').click();
  }

  // カート内の先頭商品を削除する
  async removeFirstItem() {

    // 削除ボタンが表示されるまで待機する
    await expect(
      this.page.locator('[data-test^="remove"]').first()
    ).toBeVisible();

    // 先頭商品の削除ボタンを押下する
    await this.page.locator('[data-test^="remove"]').first().click();
  }

  // カート内の商品を全件削除する
  async removeAllItems() {

    // 削除ボタン一覧を取得する
    const buttons = this.page.locator('[data-test^="remove"]');

    // 削除ボタンが無くなるまで繰り返す
    while (await buttons.count() > 0) {
      await buttons.first().click();
    }
  }

  // バッジ件数を確認する
  async expectBadgeCount(count: number) {
    await expect(
      this.page.locator('.shopping_cart_badge')
    ).toHaveText(String(count));
  }

  // バッジが非表示であることを確認する
  async expectNoBadge() {
    await expect(
      this.page.locator('.shopping_cart_badge')
    ).toHaveCount(0);
  }
}
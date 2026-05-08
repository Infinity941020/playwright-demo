import { Page, expect } from '@playwright/test';

/*
================================
CartPage（CI安定版）
================================
*/
export class CartPage {
  constructor(private page: Page) {}

  /*
  ================================
  カート画面へ遷移
  ================================
  */
  async goto() {

    // カート画面へ移動
    await this.page.goto('https://www.saucedemo.com/cart.html');

    // カート画面URLであることを確認
    await expect(this.page).toHaveURL(/cart/);

    // カート操作ボタンが表示されていることを確認
    await expect(this.page.locator('[data-test="continue-shopping"]'))
      .toBeVisible();
  }

  /*
  ================================
  カート画面表示保証
  ================================
  */
  async expectOnCartPage() {

    // カート画面URLであることを確認
    await expect(this.page).toHaveURL(/cart/);

    // Continue Shoppingボタン表示確認
    await expect(this.page.locator('[data-test="continue-shopping"]'))
      .toBeVisible();
  }

  /*
  ================================
  商品数確認
  ================================
  */
  async expectItemCount(count: number) {

    // カート内商品数確認
    await expect(this.page.locator('.cart_item')).toHaveCount(count);
  }

  /*
  ================================
  商品削除
  ================================
  */
  async removeFirstItem() {

    const removeButtons = this.page.locator('[data-test^="remove"]');

    // 削除ボタンが表示されていることを確認
    await expect(removeButtons.first()).toBeVisible();

    // 1件目削除
    await removeButtons.first().click();
  }

  /*
  ================================
  Continue Shopping（カート→一覧）
  ================================
  */
  async continueShopping() {

    const btn = this.page.locator('[data-test="continue-shopping"]');

    // ボタン表示確認
    await expect(btn).toBeVisible();

    // ボタン押下
    await btn.click();

    // 一覧画面遷移確認
    await expect(this.page).toHaveURL(/inventory/);
  }

  /*
  ================================
  全商品削除
  ================================
  */
  async removeAllItems() {

    const buttons = this.page.locator('[data-test^="remove"]');

    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      await buttons.first().click();
    }
  }

  /*
  ================================
  カート→一覧戻り（旧互換）
  ================================
  */
  async backToInventory() {

    const btn = this.page.locator(
      '[data-test="continue-shopping"], #continue-shopping'
    );

    await btn.waitFor({ state: 'visible' });
    await btn.click();

    await this.page.waitForURL(/inventory/);
  }
}
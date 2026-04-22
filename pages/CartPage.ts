// Playwright Page型を使用
import { Page, expect } from '@playwright/test';

/*
================================
CartPage（最終確定版）
================================
責務：
- カート画面の操作
- カート状態の検証
================================
*/

export class CartPage {
  constructor(private page: Page) {}

  /*
  ================================
  ① カート画面へ遷移
  ================================
  */
  async goto() {

    const cartLink = this.page.locator('.shopping_cart_link');

    await expect(cartLink).toBeVisible();
    await cartLink.click();

    await expect(this.page).toHaveURL(/cart/);
  }

  /*
  ================================
  ② 商品削除（先頭1件）
  ================================
  */
  async removeFirstItem() {

    const removeBtn = this.page.locator('button', { hasText: 'Remove' }).first();

    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
  }

  /*
  ================================
  ③ 商品全削除
  ================================
  */
  async removeAllItems() {

    const buttons = this.page.locator('button', { hasText: 'Remove' });

    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.first();
      await expect(btn).toBeVisible();
      await btn.click();
    }
  }

  /*
  ================================
  ④ カート件数確認
  ================================
  */
  async expectItemCount(count: number) {
    await expect(this.page.locator('.cart_item')).toHaveCount(count);
  }

  /*
  ================================
  ⑤ カートが空であること確認
  ================================
  */
  async expectEmpty() {
    await expect(this.page.locator('.cart_item')).toHaveCount(0);
  }

 /*
 ================================
 ⑥カート画面 → 商品一覧へ戻るボタン操作
  ================================
 */
  async continueShopping() {

  const button = this.page.locator('[data-test="continue-shopping"]');

  // ボタン表示待ち（CI安定化）
  await expect(button).toBeVisible();

  // クリックして商品一覧へ戻る
  await button.click();
}

}
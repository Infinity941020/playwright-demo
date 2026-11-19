import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';

/*
================================
CartPage（CI安定版）
================================
*/
export class CartPage {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ Continue Shoppingボタン
  // ================================
  readonly continueShoppingButton: Locator;

  // ================================
  // ■ Checkoutボタン
  // ================================
  readonly checkoutButton: Locator;

  // ================================
  // ■ カート内の商品の行
  // ================================
  // 削除した行はページ内に見えない要素（.removed_cart_item）として残るため、
  // data-test="inventory-item" を持つ行のみを数える（Python版と同じ）
  readonly cartItems: Locator;

  // ================================
  // ■ 商品削除ボタン（全商品分）
  // ================================
  readonly removeButtons: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.removeButtons = page.locator('[data-test^="remove"]');
  }

  /*
  ================================
  カート画面へ遷移
  （表示の確認は、呼び出す側で expectOnPage() を呼んで行う）
  ================================
  */
  async goto() {

    // カート画面へ移動
    await this.page.goto(urls.cart);
  }

  /*
  ================================
  カート画面表示保証
  ================================
  */
  async expectOnPage() {

    // カート画面URLであることを確認
    await expect(this.page).toHaveURL(urls.cart);

    // Continue Shoppingボタン表示確認
    await expect(this.continueShoppingButton).toBeVisible();
  }

  /*
  ================================
  商品数確認
  ================================
  */
  async expectItemCount(count: number) {

    // カート内商品数確認
    await expect(this.cartItems).toHaveCount(count);
  }

  /*
  ================================
  商品削除
  ================================
  */
  async removeFirstItem() {

    // 削除ボタンが表示されていることを確認
    await expect(this.removeButtons.first()).toBeVisible();

    // 1件目削除
    await this.removeButtons.first().click();
  }

  /*
  ================================
  Continue Shopping（カート→一覧）
  ================================
  */
  async continueShopping() {

    // ボタン押下（商品一覧画面の確認は、呼び出す側で InventoryPage.expectOnPage() を呼んで行う）
    await this.continueShoppingButton.click();
  }

  /*
  ================================
  Checkout開始（カート→Checkout Step One）
  ================================
  */
  async clickCheckout() {

    // ボタン押下（Step One画面の確認は、呼び出す側で CheckoutStepOnePage.expectOnPage() を呼んで行う）
    await this.checkoutButton.click();
  }

  /*
  ================================
  全商品削除
  ================================
  */
  async removeAllItems() {

    const count = await this.removeButtons.count();

    for (let i = 0; i < count; i++) {
      await this.removeButtons.first().click();
    }
  }

  /*
  ================================
  カート→一覧戻り（旧互換）
  ================================
  */
  async backToInventory() {

    // ボタン押下（商品一覧画面の確認は、呼び出す側で InventoryPage.expectOnPage() を呼んで行う）
    await this.continueShoppingButton.click();
  }
}

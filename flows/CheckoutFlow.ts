// PlaywrightのPage
import { Page } from '@playwright/test';

// Page Object
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/*
================================
CheckoutFlow（安定版）
責務：
- 状態を作らない
- シナリオを持たない
- 操作のみ提供
================================
*/
export class CheckoutFlow {

  private inventory: InventoryPage;
  private cart: CartPage;
  private checkout: CheckoutPage;

  constructor(page: Page) {
    this.inventory = new InventoryPage(page);
    this.cart = new CartPage(page);
    this.checkout = new CheckoutPage(page);
  }

  // =================================================
  // ■ Setup系（状態を作るだけ）
  // =================================================

  async addItems(count: 'single' | 'multi' = 'single') {
    await this.inventory.goto();

    if (count === 'single') {
      await this.inventory.addFirstItem();
    } else {
      await this.inventory.addAllItems();
    }
  }

  async goToCart() {
    await this.cart.goto();
  }

  async startCheckoutFromCart() {
    await this.checkout.startCheckout();
  }

  async proceedToCheckoutStepTwo() {
    await this.checkout.continue();
  }

  // =================================================
  // ■ Action系（操作のみ）
  // =================================================

  async fillCheckoutInfo(first: string, last: string, zip: string) {
    await this.checkout.fillInfo(first, last, zip);
  }

  async continueCheckout() {
    await this.checkout.continue();
  }

  async continueExpectError() {
    await this.checkout.continueExpectError();
  }

  async finishCheckout() {
    await this.checkout.finish();
  }

  // =================================================
  // ■ Cancel系（状態依存しない単体操作）
  // =================================================

  async cancelFromStepOne() {
    await this.checkout.cancelFromStepOne();
  }

  async cancelFromStepTwo() {
    await this.checkout.cancelFromStepTwo();
  }

  // =================================================
  // ■ Assert系（必要時のみ）
  // =================================================

  async expectComplete() {
    await this.checkout.expectComplete();
  }

  async goToCheckoutStepOne() {
  await this.checkout.startCheckout();
  }

  async goToCheckoutStepTwo() {
  await this.checkout.continue();
  }

// =================================================
// ■ カート → 商品一覧へ戻る（状態前提版）
// =================================================
  async cancelFromCart() {
  await this.cart.backToInventory();
  }
}
// PlaywrightのPage
import { Page } from '@playwright/test';

// Page Object
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/*
================================
CheckoutFlow（完全統一版・最終安定）
================================
責務：
- 業務単位の操作のみ提供
- 状態生成・遷移・入力・完了操作に統一
- spec互換をFlow側で完全吸収
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
  // ■ 状態生成（商品準備）
  // =================================================

  async addSingleItem() {
    await this.inventory.goto();
    await this.inventory.addFirstItem();
  }

  async addMultipleItems() {
    await this.inventory.goto();
    await this.inventory.addAllItems();
  }

  // =================================================
  // ■ 旧仕様互換（既存spec対応）
  // =================================================

  async addItems(type: 'single' | 'multi' = 'single') {
    if (type === 'single') {
      await this.addSingleItem();
    } else {
      await this.addMultipleItems();
    }
  }

  async addItemsLegacy(type: 'single' | 'multi' = 'single') {
    return this.addItems(type);
  }

  // Checkout spec互換
  async goToCheckoutStepOne() {
    await this.checkout.startCheckout();
  }

  async goToCheckoutStepTwo() {
    await this.checkout.continue();
  }

  // =================================================
  // ■ 遷移（業務フロー）
  // =================================================

  async goToCart() {
    await this.cart.goto();
  }

  async startCheckout() {
    await this.checkout.startCheckout();
  }

  // =================================================
  // ■ 入力操作
  // =================================================

  async fillCheckoutInfo(first: string, last: string, zip: string) {
    await this.checkout.fillInfo(first, last, zip);
  }

  // =================================================
  // ■ 実行操作
  // =================================================

  async continueCheckout() {
    await this.checkout.continue();
  }

  async finishCheckout() {
    await this.checkout.finish();
  }

  // =================================================
  // ■ エラー系操作
  // =================================================

  async continueExpectError() {
    await this.checkout.continueExpectError();
  }

  // =================================================
  // ■ キャンセル系
  // =================================================

  async cancelFromStepOne() {
    await this.checkout.cancelFromStepOne();
  }

  async cancelFromStepTwo() {
    await this.checkout.cancelFromStepTwo();
  }

  async cancelFromCart() {
    await this.cart.backToInventory();
  }

  // =================================================
  // ■ 検証（最小限）
  // =================================================

  async expectComplete() {
    await this.checkout.expectComplete();
  }
}
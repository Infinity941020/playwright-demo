// PlaywrightのPage
import { Page } from '@playwright/test';

// Page Object
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import {
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  CheckoutCompletePage,
} from '../pages/CheckoutPage';

/*
================================
CheckoutFlow（業務用語統一版）
================================
責務：
- 業務単位の操作のみ提供
- UI操作を隠蔽しシナリオ化
- specはFlowのみを呼び出す構造
================================
*/
export class CheckoutFlow {

  // 商品一覧ページ操作
  private inventory: InventoryPage;

  // カート画面操作
  private cart: CartPage;

  // Checkout画面操作（画面ごと）
  private stepOne: CheckoutStepOnePage;
  private stepTwo: CheckoutStepTwoPage;
  private complete: CheckoutCompletePage;

  /*
  ================================
  コンストラクタ
  ================================
  */
  constructor(page: Page) {

    this.inventory = new InventoryPage(page);
    this.cart = new CartPage(page);
    this.stepOne = new CheckoutStepOnePage(page);
    this.stepTwo = new CheckoutStepTwoPage(page);
    this.complete = new CheckoutCompletePage(page);
  }

  // =================================================
  // ■ 商品準備（状態生成）
  // =================================================

  async addSingleItem() {

    await this.inventory.expectOnPage();
    await this.inventory.addFirstItem();
  }

  async addMultipleItems() {

    await this.inventory.expectOnPage();
    await this.inventory.addAllItems();
  }

  async addItems(type: 'single' | 'multi' = 'single') {

    if (type === 'single') {

      await this.addSingleItem();
    } else {

      await this.addMultipleItems();
    }
  }

  // =================================================
  // ■ 画面遷移（業務フロー）
  // =================================================

  async goToCart() {

    await this.cart.goto();
    await this.cart.expectOnPage();
  }

  async startCheckout() {

    await this.cart.clickCheckout();
    await this.stepOne.expectOnPage();
  }

  // =================================================
  // ■ 入力操作
  // =================================================

  async fillCheckoutInfo(first: string, last: string, zip: string) {

    await this.stepOne.fillInfo(first, last, zip);
  }

  // =================================================
  // ■ 購入フロー（業務用語化）
  // =================================================

  async proceedToOverviewStep() {

    await this.stepOne.clickContinue();
    await this.stepTwo.expectOnPage();
  }

  async completePurchase() {

    await this.stepTwo.clickFinish();
    await this.complete.expectOnPage();
  }

  // =================================================
  // ■ エラー確認
  // =================================================

  async continueExpectError() {

    await this.stepOne.clickContinue();

    // Step Oneに留まり、エラーが表示されることを確認
    await this.stepOne.expectOnPage();
    await this.stepOne.expectErrorVisible();
  }

  // =================================================
  // ■ キャンセル操作
  // =================================================

  async cancelFromStepOne() {

    await this.stepOne.clickCancel();
    await this.cart.expectOnPage();
  }

  async cancelFromStepTwo() {

    await this.stepTwo.clickCancel();
    await this.inventory.expectOnPage();
  }

  async cancelFromCart() {

    await this.cart.backToInventory();
    await this.inventory.expectOnPage();
  }

 // =================================================
 // ■ 検証
 // =================================================

 // 購入完了状態を検証
  async verifyOrderComplete() {

   await this.complete.expectOnPage();
   await this.complete.expectCompleteHeaderVisible();
  }
}
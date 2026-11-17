// PlaywrightのPage
import { Page } from '@playwright/test';

// Page Object
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

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

  // チェックアウト画面操作
  private checkout: CheckoutPage;

  /*
  ================================
  コンストラクタ
  ================================
  */
  constructor(page: Page) {

    this.inventory = new InventoryPage(page);
    this.cart = new CartPage(page);
    this.checkout = new CheckoutPage(page);
  }

  // =================================================
  // ■ 商品準備（状態生成）
  // =================================================

  async addSingleItem() {

    await this.inventory.goto();
    await this.inventory.addFirstItem();
  }

  async addMultipleItems() {

    await this.inventory.goto();
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
  // ■ 購入フロー（業務用語化）
  // =================================================

  async proceedToOverviewStep() {

    await this.checkout.continue();
  }

  async completePurchase() {

    await this.checkout.finish();
  }

  // =================================================
  // ■ エラー確認
  // =================================================

  async continueExpectError() {

    await this.checkout.continueExpectError();
  }

  // =================================================
  // ■ キャンセル操作
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
 // ■ 検証
 // =================================================

 // 購入完了状態を検証
  async verifyOrderComplete() {

   await this.checkout.expectComplete();
  }
}
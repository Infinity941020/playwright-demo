// PlaywrightのPage型を使用
import { Page } from '@playwright/test';

// 各画面Page Object
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/*
================================
CheckoutFlow（Flow最終安定版）
正常系 / 異常系 / キャンセル系統合
================================
*/
export class CheckoutFlow {

  // 商品一覧画面
  private inventory: InventoryPage;

  // カート画面
  private cart: CartPage;

  // Checkout画面
  private checkout: CheckoutPage;

  /*
  ================================
  コンストラクタ
  ================================
  */
  constructor(page: Page) {

    // 各Page Object初期化
    this.inventory = new InventoryPage(page);
    this.cart = new CartPage(page);
    this.checkout = new CheckoutPage(page);
  }

  /*
  ================================
  商品追加してカート画面へ
  ================================
  */
  async prepareCartWithItem(
    count: 'single' | 'multi' = 'single'
  ) {

    // 商品一覧へ移動
    await this.inventory.goto();

    // 商品追加
    if (count === 'single') {
      await this.inventory.addFirstItem();
    } else {
      await this.inventory.addAllItems();
    }

    // カート画面へ移動
    await this.cart.goto();
  }

  /*
  ================================
  Checkout Step1まで進む
  ================================
  */
  async prepareCheckoutWithItem(
    count: 'single' | 'multi' = 'single'
  ) {

    // カート画面まで準備
    await this.prepareCartWithItem(count);

    // Checkout開始
    await this.checkout.startCheckout();
  }

  /*
  ================================
  Checkout Step2まで進む
  ================================
  */
  async prepareCheckoutStepTwo(
    count: 'single' | 'multi' = 'single',
    first = 'Taro',
    last = 'Yamada',
    zip = '12345'
  ) {

    // Step1まで進む
    await this.prepareCheckoutWithItem(count);

    // 入力
    await this.fillCheckoutInfo(
      first,
      last,
      zip
    );

    // Step2へ進む
    await this.goToStepTwo();
  }

  /*
  ================================
  入力のみ
  ================================
  */
  async fillCheckoutInfo(
    first: string,
    last: string,
    zip: string
  ) {

    await this.checkout.fillInfo(
      first,
      last,
      zip
    );
  }

  /*
  ================================
  Step2へ進む
  ================================
  */
  async goToStepTwo() {

    await this.checkout.continue();
  }

  /*
  ================================
  購入完了
  ================================
  */
  async completePurchase(
    first: string,
    last: string,
    zip: string
  ) {

    // Step1入力
    await this.fillCheckoutInfo(
      first,
      last,
      zip
    );

    // Step2へ
    await this.goToStepTwo();

    // 完了
    await this.checkout.finish();
  }

  /*
  ================================
  入力エラー確認
  ================================
  */
  async expectValidationError(
    first: string,
    last: string,
    zip: string
  ) {

    // 入力
    await this.fillCheckoutInfo(
      first,
      last,
      zip
    );

    // エラー確認
    await this.checkout.continueExpectError();
  }

  /*
  ================================
  カート画面から一覧へ戻る
  ================================
  */
  async cancelFromCart() {

    await this.cart.continueShopping();
  }

  /*
  ================================
  Step1からカートへ戻る
  ================================
  */
  async cancelFromStepOne() {

    await this.checkout.cancelFromStepOne();
  }

  /*
  ================================
  Step2から一覧へ戻る
  ================================
  */
  async cancelFromStepTwo() {

    await this.checkout.cancelFromStepTwo();
  }

  /*
  ================================
  完了画面確認
  ================================
  */
  async expectComplete() {

    await this.checkout.expectComplete();
  }

  /*
  ================================
  Step1画面確認
  ================================
  */
  async expectOnStepOne() {

    await this.checkout.expectOnStepOne();
  }

  /*
  ================================
  Step2画面確認
  ================================
  */
  async expectOnStepTwo() {

    await this.checkout.expectOnStepTwo();
  }
}
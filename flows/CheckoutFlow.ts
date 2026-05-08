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

  // Pageインスタンスを受け取り各PageObjectを生成
  constructor(page: Page) {

    this.inventory = new InventoryPage(page);
    this.cart = new CartPage(page);
    this.checkout = new CheckoutPage(page);
  }

  // =================================================
  // ■ 状態生成（商品準備）
  // =================================================

  // 単一商品を追加する業務操作
  async addSingleItem() {

    await this.inventory.goto();
    await this.inventory.addFirstItem();
  }

  // 複数商品を追加する業務操作
  async addMultipleItems() {

    await this.inventory.goto();
    await this.inventory.addAllItems();
  }

  // =================================================
  // ■ 旧仕様互換（既存spec対応）
  // =================================================

  // 商品追加（single / multi）
  async addItems(type: 'single' | 'multi' = 'single') {

    if (type === 'single') {

      await this.addSingleItem();
    } else {

      await this.addMultipleItems();
    }
  }

  // 旧spec互換メソッド（内部委譲）
  async addItemsLegacy(type: 'single' | 'multi' = 'single') {

    return this.addItems(type);
  }

  // =================================================
  // ■ 遷移（業務フロー）
  // =================================================

  // カート画面へ遷移
  async goToCart() {

    await this.cart.goto();
  }

  // チェックアウト開始
  async startCheckout() {

    await this.checkout.startCheckout();
  }

  // =================================================
  // ■ 入力操作
  // =================================================

  // チェックアウト情報入力
  async fillCheckoutInfo(first: string, last: string, zip: string) {

    await this.checkout.fillInfo(first, last, zip);
  }

  // =================================================
  // ■ 実行操作
  // =================================================

  // 次へ（正常系）
  async continueCheckout() {

    await this.checkout.continue();
  }

  // 完了処理
  async finishCheckout() {

    await this.checkout.finish();
  }

  // =================================================
  // ■ エラー系操作
  // =================================================

  // 次へ押下（エラー確認）
  async continueExpectError() {

    await this.checkout.continueExpectError();
  }

  // =================================================
  // ■ キャンセル系
  // =================================================

  // Step1からキャンセル
  async cancelFromStepOne() {

    await this.checkout.cancelFromStepOne();
  }

  // Step2からキャンセル
  async cancelFromStepTwo() {

    await this.checkout.cancelFromStepTwo();
  }

  // カートから戻る
  async cancelFromCart() {

    await this.cart.backToInventory();
  }

  // =================================================
  // ■ 検証（最小限）
  // =================================================

  // 完了画面検証
  async expectComplete() {

    await this.checkout.expectComplete();
  }
}
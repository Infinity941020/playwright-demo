// PlaywrightのPage
import { Page } from '@playwright/test';

// Page Object
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { HeaderComponent } from '../pages/HeaderComponent';

/*
================================
CartFlow（最終完成版・統一後）
責務：
- 業務シナリオのみ提供
- Page Objectの隠蔽
- specからUI詳細を排除
================================
*/
export class CartFlow {

  // CartPageインスタンス（カート画面操作を担当）
  private cartPage: CartPage;

  // InventoryPageインスタンス（商品一覧操作を担当）
  private inventory: InventoryPage;

  // HeaderComponentインスタンス（ヘッダー操作・バッジ検証を担当）
  private header: HeaderComponent;

  /*
  ================================
  コンストラクタ
  ================================
  */

  // Pageインスタンスを受け取り各PageObjectを初期化
  constructor(page: Page) {

    this.cartPage = new CartPage(page);
    this.inventory = new InventoryPage(page);
    this.header = new HeaderComponent(page);
  }

  // ================================
  // ■ 状態作成（Arrange）
  // ================================

  // 商品をカートに追加する業務フロー（単一 or 複数）
  async addItems(type: 'single' | 'multi' = 'single'): Promise<number> {

    await this.inventory.goto();

    if (type === 'single') {

      await this.inventory.addFirstItem();
      return 1;
    }

    const count = await this.inventory.addAllItems();
    return count;
  }

  // ================================
  // ■ 画面遷移
  // ================================

  // カート画面へ遷移する操作
  async openCart() {

    await this.cartPage.goto();
  }

  // ================================
  // ■ 操作（Act）
  // ================================

  // カート内の1件目商品を削除する操作
  async removeFirstItem() {

    await this.cartPage.removeFirstItem();
  }

  // カート内商品をすべて削除する操作
  async clearCart() {

    await this.cartPage.removeAllItems();
  }

  // 商品一覧へ戻る操作
  async continueShopping() {

    await this.cartPage.continueShopping();
  }

  // ================================
  // ■ 検証（Headerレベル）
  // ================================

  /*
  ================================
  カートバッジ件数検証
  ================================
  */

  // カートバッジ件数を検証する
  async expectBadgeCount(expected: number) {

    await this.header.expectBadgeCount(expected);
  }

  // ================================
  // ■ 検証（Cartレベル）
  // ================================

  // カート内商品数を検証する（Pageへ委譲）
  async expectItemCount(expected: number) {

    await this.cartPage.expectItemCount(expected);
  }
}
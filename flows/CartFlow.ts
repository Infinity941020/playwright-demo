// Playwrightのページコンテキスト（各画面操作の起点となるブラウザページ）
import { Page } from '@playwright/test';

// カート画面のUI操作を担当するPage Object
import { CartPage } from '../pages/CartPage';

// ヘッダー領域（カートバッジなど）のUI検証用コンポーネント
import { HeaderComponent } from '../pages/HeaderComponent';

/**
 * CartFlow（業務フロー層）
 *
 * カート操作を単なるUI操作ではなく、
 * 「業務シナリオ単位」で扱うための抽象レイヤー
 *
 * 例：
 * - 商品削除 → バッジ状態確認
 * - カート全削除 → 空状態確認
 */
export class CartFlow {

  private cartPage: CartPage;
  private header: HeaderComponent;

  constructor(page: Page) {
    this.cartPage = new CartPage(page);
    this.header = new HeaderComponent(page);
  }

  // カート画面へ遷移
  async openCart() {
    await this.cartPage.goto();
  }

  // ================================
  // 互換メソッド（spec互換維持）
  // ================================

  // バッジ件数確認
  async expectBadgeCount(expectedCount: number) {
    await this.header.expectBadgeCount(expectedCount);
  }

  // 先頭商品削除
  async removeFirstItem() {
    await this.cartPage.removeFirstItem();
  }

  // 全商品削除
  async clearCart() {
    await this.cartPage.removeAllItems();
  }

  // 商品削除 → バッジが0になることを確認
  async removeItemAndVerifyBadge() {
    await this.cartPage.removeFirstItem();
    await this.header.expectBadgeCount(0);
  }

  // 全削除 → カート空状態（バッジ非表示）を確認
  async clearCartAndVerifyEmpty() {
    await this.cartPage.removeAllItems();
    await this.header.expectBadgeCount(0);
  }

  // カート件数の状態確認（汎用チェック）
  async verifyCartState(expectedCount: number) {
    await this.header.expectBadgeCount(expectedCount);
  }
}
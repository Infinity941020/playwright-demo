// PlaywrightのPage型を使用
import { Page, expect } from '@playwright/test';

// CartPage（UI操作）
import { CartPage } from '../pages/CartPage';

// HeaderComponent（バッジ確認用）
import { HeaderComponent } from '../pages/HeaderComponent';

// カート業務フロー
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

  // 商品1件削除
  async removeFirstItem() {
    await this.cartPage.removeFirstItem();
  }

  // 全削除
  async clearCart() {
    await this.cartPage.removeAllItems();
  }

  // バッジ件数確認（Flowに統一）
  async expectBadgeCount(count: number) {
    await this.header.expectBadgeCount(count);
  }

  // 商品追加後のバッジ確認（任意ラップ）
  async expectBadgeAfterAdd(count: number) {
    await this.header.expectBadgeCount(count);
  }
}
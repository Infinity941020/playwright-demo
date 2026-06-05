/*
CartFlow（最終修正版）
*/

import { Page } from '@playwright/test';

import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { HeaderComponent } from '../pages/HeaderComponent';

export class CartFlow {

  private cartPage: CartPage;
  private inventory: InventoryPage;
  private header: HeaderComponent;

  constructor(page: Page) {

    this.cartPage = new CartPage(page);
    this.inventory = new InventoryPage(page);
    this.header = new HeaderComponent(page);
  }

  async addItems(type: 'single' | 'multi' = 'single'): Promise<number> {

    await this.inventory.goto();

    if (type === 'single') {

      await this.inventory.addFirstItem();
      return 1;
    }

    return await this.inventory.addAllItems();
  }

  async openCart() {
    await this.cartPage.goto();
  }

  async removeFirstItem() {
    await this.cartPage.removeFirstItem();
  }

  async clearCart() {
    await this.cartPage.removeAllItems();
  }

  async continueShopping() {
    await this.cartPage.continueShopping();
  }

  /*
  ================================
  カート内商品件数確認
  ================================
  */
  async expectItemCount(expected: number) {

    await this.cartPage.expectItemCount(expected);
  }

  /*
  ================================
  カートバッジ件数確認
  ================================
  */
  async expectBadgeCount(expected: number) {

    await this.header.expectBadgeCount(expected);
  }

  /*
  ================================
  ■ 追加（検証用アクセサ）
  ================================
  */
  getCartPage() {
    return this.cartPage;
  }
}
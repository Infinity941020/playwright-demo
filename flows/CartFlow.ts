// PlaywrightのPage
import { Page } from '@playwright/test';

// Page Object
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { HeaderComponent } from '../pages/HeaderComponent';

/*
================================
CartFlow（最終完成版）
責務：
- 業務シナリオのみ提供
- Page Objectの隠蔽
- specからUI詳細を排除
================================
*/
export class CartFlow {

  private cartPage: CartPage;
  private inventory: InventoryPage;
  private header: HeaderComponent;

  constructor(page: Page) {
    this.cartPage = new CartPage(page);
    this.inventory = new InventoryPage(page);
    this.header = new HeaderComponent(page);
  }

  // ================================
  // ■ 状態作成（Arrange）
  // ================================

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

  async openCart() {
    await this.cartPage.goto();
  }

  // ================================
  // ■ 操作（Act）
  // ================================

  async removeFirstItem() {
    await this.cartPage.removeFirstItem();
  }

  async clearCart() {
    await this.cartPage.removeAllItems();
  }

  async continueShopping() {
    await this.cartPage.continueShopping();
  }

  // ================================
  // ■ 検証（Assert）
  // ================================

  async expectBadgeCount(expected: number) {
    await this.header.expectBadgeCount(expected);
  }

  async expectItemCount(expected: number) {
    await this.cartPage.expectItemCount(expected);
  }

  // ================================
  // ■ シナリオ系（必要最小限）
  // ================================

  async removeAllAndVerifyEmpty() {
    await this.cartPage.removeAllItems();
    await this.header.expectBadgeCount(0);
  }
}
import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

// 商品一覧画面の操作と、その結果の確認を、利用者の操作の単位でまとめる。
// 今は、商品一覧画面が表示されていることの確認だけを持つ
export class InventoryFlow {

  private inventoryPage: InventoryPage;

  constructor(page: Page) {
    this.inventoryPage = new InventoryPage(page);
  }

  async expectOnInventoryPage() {
    await this.inventoryPage.expectOnPage();
  }
}

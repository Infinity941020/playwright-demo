import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

// 商品一覧画面を開く操作と、商品一覧画面が表示されていることの確認をまとめる
export class InventoryFlow {

  private readonly inventoryPage: InventoryPage;

  constructor(page: Page) {
    this.inventoryPage = new InventoryPage(page);
  }

  // 商品一覧画面の URL を開く（表示は確かめないので、確かめるときは続けて表示の確認を呼ぶ）
  async accessInventoryDirectly() {
    await this.inventoryPage.goto();
  }

  async expectOnInventoryPage() {
    await this.inventoryPage.expectOnPage();
  }
}

// PlaywrightのPage型・Locator型・expectを使用
import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';

/*
================================
InventoryPage
商品一覧画面操作用 Page Object
================================
*/
export class InventoryPage {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ 商品一覧
  // ================================
  readonly inventoryList: Locator;

  // ================================
  // ■ 商品追加ボタン（全商品分）
  // ================================
  readonly addToCartButtons: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
  }

  /*
  ================================
  商品一覧画面へ遷移
  （表示の確認は、呼び出す側で expectOnPage() を呼んで行う）
  ================================
  */
  async goto() {

    await this.page.goto(urls.inventory);
  }

  /*
  ================================
  商品一覧画面表示確認
  ================================
  */
  async expectOnPage() {

    // inventory画面URL確認
    await expect(this.page).toHaveURL(urls.inventory);

    // 商品一覧表示確認
    await expect(this.inventoryList).toBeVisible();
  }

  /*
  ================================
  全商品をカートに追加（安定版）
  ================================
  */
  async addAllItems() {

    // ボタン表示待機
    await expect(this.addToCartButtons.first()).toBeVisible();

    // ボタン件数取得
    const count = await this.addToCartButtons.count();

    // 先頭ボタンを順番に押下
    // 押下後はremoveへ変化するためfirst固定
    for (let i = 0; i < count; i++) {

      // 先頭ボタン押下
      await this.addToCartButtons.first().click();
    }

    // 追加件数返却
    return count;
  }

  /*
  ================================
  商品を1件追加
  ================================
  */
  async addFirstItem() {

    // 最初の商品追加ボタン表示確認
    await expect(this.addToCartButtons.first()).toBeVisible();

    // 最初の商品追加ボタン押下
    await this.addToCartButtons.first().click();
  }
}

import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { HeaderComponent } from '../pages/HeaderComponent';
import { CartPage } from '../pages/CartPage';
import { Product } from '../data/products';

// 商品一覧画面での操作と、その結果の確認を、利用者の操作の単位でまとめる。
// テストから画面の細かい操作を直接扱わずに済むようにする
export class InventoryFlow {

  private readonly inventoryPage: InventoryPage;
  private readonly header: HeaderComponent;

  // カートアイコンを押した後に移る、カート画面の表示を確かめるために使う
  private readonly cartPage: CartPage;

  constructor(page: Page) {

    this.inventoryPage = new InventoryPage(page);
    this.header = new HeaderComponent(page);
    this.cartPage = new CartPage(page);
  }

  // 商品一覧画面の URL を開く（表示は確かめないので、確かめるときは続けて表示を確かめる処理も呼ぶ）
  async accessInventoryDirectly() {
    await this.inventoryPage.goto();
  }

  // 商品詳細画面の URL を開く（表示は確かめないので、確かめるときは続けて表示を確かめる処理も呼ぶ）
  async accessProductDetailDirectly(productId: number) {
    await this.inventoryPage.gotoProductDetail(productId);
  }

  // 再読み込みでログイン画面へ戻された場合などに、別の画面のまま確認を続けないよう、商品一覧画面であることを確かめる
  async reloadInventory() {

    await this.inventoryPage.reload();
    await this.inventoryPage.expectOnPage();
  }

  async sortBy(optionLabel: string) {
    await this.inventoryPage.selectSort(optionLabel);
  }

  async addToCart(productName: string) {
    await this.inventoryPage.addToCart(productName);
  }

  async removeFromCart(productName: string) {
    await this.inventoryPage.removeFromCart(productName);
  }

  // 商品名または商品画像から、商品詳細画面を開く
  async openProductDetail(productName: string, via: 'name' | 'image') {

    if (via === 'name') {
      await this.inventoryPage.clickProductName(productName);
    } else {
      await this.inventoryPage.clickProductImage(productName);
    }
  }

  async openCart() {
    await this.header.clickCartIcon();
  }

  // 商品一覧の表示を確かめる（件数、各商品の表示項目、商品名と価格の組み合わせ）
  async expectProductsDisplayed(products: readonly Product[]) {

    await this.inventoryPage.expectProductCount(products.length);
    await this.inventoryPage.expectAllProductElementsVisible();

    for (const product of products) {
      await this.inventoryPage.expectProductPrice(product.name, product.price);
    }
  }

  async expectProductNamesInOrder(productNames: string[]) {
    await this.inventoryPage.expectProductNames(productNames);
  }

  async expectProductPricesInOrder(prices: string[]) {
    await this.inventoryPage.expectProductPrices(prices);
  }

  async expectSelectedSort(optionLabel: string) {
    await this.inventoryPage.expectSelectedSort(optionLabel);
  }

  // 商品のボタンが Remove と表示されていることを確かめる（カートに追加済みの状態）
  async expectRemoveButtonShown(productName: string) {
    await this.inventoryPage.expectRemoveButton(productName);
  }

  // 商品のボタンが Add to cart と表示されていることを確かめる（カートに追加していない状態）
  async expectAddToCartButtonShown(productName: string) {
    await this.inventoryPage.expectAddToCartButton(productName);
  }

  async expectBadgeCount(count: number) {
    await this.header.expectBadgeCount(count);
  }

  async expectOnInventoryPage() {
    await this.inventoryPage.expectOnPage();
  }

  async expectOnProductDetailPage(productId: number) {
    await this.inventoryPage.expectOnProductDetailPage(productId);
  }

  async expectOnCartPage() {
    await this.cartPage.expectOnPage();
  }
}

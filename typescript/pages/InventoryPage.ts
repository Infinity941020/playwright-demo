import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';
import { exactText } from '../utils/regExp';

// 商品一覧画面の操作と、画面の表示の確認をまとめる。
// - 商品ごとの部分（ボタン・価格など）は、並べ替えで並び順が変わっても同じ商品を操作できるように、商品名で商品のカードを探してから、その中で探す
// - 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示を確かめる処理も呼ぶ
export class InventoryPage {

  private readonly page: Page;
  private readonly inventoryList: Locator;
  private readonly inventoryItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemDescriptions: Locator;
  private readonly itemPrices: Locator;
  private readonly itemImages: Locator;
  private readonly itemImageLinks: Locator;
  private readonly itemAddToCartButton: Locator;
  private readonly itemRemoveButton: Locator;
  private readonly sortSelect: Locator;
  private readonly activeSortOption: Locator;

  constructor(page: Page) {

    this.page = page;

    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');

    // 商品画像と画像のリンクのテスト用の属性には、商品ごとに違う名前が入るため、名前の終わりの部分で探す
    this.itemImages = page.locator('img[data-test$="-img"]');
    this.itemImageLinks = page.locator('a[data-test$="-img-link"]');

    // ボタンのテスト用の属性には商品ごとに違う名前が入るため、カードの中でボタンの文言で探す。文言で、追加済みかどうかも区別できる
    this.itemAddToCartButton = page.getByRole('button', { name: 'Add to cart', exact: true });
    this.itemRemoveButton = page.getByRole('button', { name: 'Remove', exact: true });

    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('[data-test="active-option"]');
  }

  // 商品名が完全に一致する商品のカード（名前の一部が同じ、別の商品を選ばないようにする）
  private item(productName: string): Locator {

    return this.inventoryItems.filter({ has: this.itemNames.filter({ hasText: exactText(productName) }) });
  }

  async goto() {
    await this.page.goto(urls.inventory);
  }

  async gotoProductDetail(productId: number) {
    await this.page.goto(`${urls.inventoryItem}?id=${productId}`);
  }

  async reload() {
    await this.page.reload();
  }

  async selectSort(optionLabel: string) {
    await this.sortSelect.selectOption({ label: optionLabel });
  }

  async addToCart(productName: string) {
    await this.item(productName).locator(this.itemAddToCartButton).click();
  }

  async removeFromCart(productName: string) {
    await this.item(productName).locator(this.itemRemoveButton).click();
  }

  async clickProductName(productName: string) {
    await this.item(productName).locator(this.itemNames).click();
  }

  async clickProductImage(productName: string) {
    await this.item(productName).locator(this.itemImageLinks).click();
  }

  // 商品一覧画面が表示されていることを確かめる（URL が完全に一致し、商品一覧が見えている）
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.inventory);
    await expect(this.inventoryList).toBeVisible();
  }

  async expectProductCount(count: number) {
    await expect(this.inventoryItems).toHaveCount(count);
  }

  // すべての商品に、画像・商品名・説明・価格・Add to cart ボタンが表示されていることを確かめる
  async expectAllProductElementsVisible() {

    // 商品がまだ表示されていないと、何も確かめずに終わってしまうため、最初の商品が表示されるのを待つ
    await expect(this.inventoryItems.first()).toBeVisible();

    for (const item of await this.inventoryItems.all()) {

      await expect(item.locator(this.itemImages)).toBeVisible();
      await expect(item.locator(this.itemNames)).toBeVisible();
      await expect(item.locator(this.itemDescriptions)).toBeVisible();
      await expect(item.locator(this.itemPrices)).toBeVisible();
      await expect(item.locator(this.itemAddToCartButton)).toBeVisible();
    }
  }

  async expectProductPrice(productName: string, price: string) {
    await expect(this.item(productName).locator(this.itemPrices)).toHaveText(price);
  }

  // 商品名が、渡した順に並んでいることを確かめる
  async expectProductNames(productNames: string[]) {
    await expect(this.itemNames).toHaveText(productNames);
  }

  // 価格が、渡した順に並んでいることを確かめる
  async expectProductPrices(prices: string[]) {
    await expect(this.itemPrices).toHaveText(prices);
  }

  async expectSelectedSort(optionLabel: string) {
    await expect(this.activeSortOption).toHaveText(optionLabel);
  }

  async expectAddToCartButton(productName: string) {
    await expect(this.item(productName).locator(this.itemAddToCartButton)).toBeVisible();
  }

  async expectRemoveButton(productName: string) {
    await expect(this.item(productName).locator(this.itemRemoveButton)).toBeVisible();
  }

  // 商品詳細画面へ移ったことを確かめる（画面の中身は確かめない）
  async expectOnProductDetailPage(productId: number) {
    await expect(this.page).toHaveURL(`${urls.inventoryItem}?id=${productId}`);
  }
}

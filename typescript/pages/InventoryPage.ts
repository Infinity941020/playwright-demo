import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';

// 商品一覧画面の操作と、画面の表示の確認をまとめる。
// - 商品ごとの部分（ボタン・価格など）は、商品名で商品のカードを探してから、その中で探す
// - 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示の確認も呼ぶ
export class InventoryPage {

  private readonly page: Page;
  private readonly inventoryList: Locator;
  private readonly inventoryItems: Locator;
  private readonly itemNames: Locator;
  private readonly itemDescriptions: Locator;
  private readonly itemPrices: Locator;
  private readonly itemImages: Locator;
  private readonly itemImageLinks: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly addToCartButtons: Locator;
  private readonly sortSelect: Locator;
  private readonly activeSortOption: Locator;

  constructor(page: Page) {

    this.page = page;

    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');

    // 商品画像には data-test がないため、CSS のクラスで探す
    this.itemImages = page.locator('img.inventory_item_img');
    this.itemImageLinks = page.locator('a[data-test$="-img-link"]');

    // 商品のカードの中で使う、ボタンの文言での探し方
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart', exact: true });
    this.removeButton = page.getByRole('button', { name: 'Remove', exact: true });

    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('[data-test="active-option"]');
  }

  // 商品名が完全に一致する商品のカード（名前の一部が同じ、別の商品を選ばないようにする）
  private item(productName: string): Locator {

    const exactName = new RegExp(`^${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);

    return this.inventoryItems.filter({ has: this.itemNames.filter({ hasText: exactName }) });
  }

  async goto() {
    await this.page.goto(urls.inventory);
  }

  async reload() {
    await this.page.reload();
  }

  async selectSort(optionLabel: string) {
    await this.sortSelect.selectOption({ label: optionLabel });
  }

  async addToCart(productName: string) {
    await this.item(productName).locator(this.addToCartButton).click();
  }

  async removeFromCart(productName: string) {
    await this.item(productName).locator(this.removeButton).click();
  }

  async clickProductName(productName: string) {
    await this.item(productName).locator(this.itemNames).click();
  }

  async clickProductImage(productName: string) {
    await this.item(productName).locator(this.itemImageLinks).click();
  }

  // 並んでいる商品を、上から順にすべてカートに追加し、追加した件数を返す
  async addAllItems() {

    await expect(this.addToCartButtons.first()).toBeVisible();

    const count = await this.addToCartButtons.count();

    // 押したボタンは Remove に変わり、追加用のボタンの一覧から外れるため、毎回先頭を押す
    for (let i = 0; i < count; i++) {
      await this.addToCartButtons.first().click();
    }

    return count;
  }

  async addFirstItem() {

    await expect(this.addToCartButtons.first()).toBeVisible();
    await this.addToCartButtons.first().click();
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

    for (const item of await this.inventoryItems.all()) {

      await expect(item.locator(this.itemImages)).toBeVisible();
      await expect(item.locator(this.itemNames)).toBeVisible();
      await expect(item.locator(this.itemDescriptions)).toBeVisible();
      await expect(item.locator(this.itemPrices)).toBeVisible();
      await expect(item.locator(this.addToCartButton)).toBeVisible();
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
    await expect(this.item(productName).locator(this.addToCartButton)).toBeVisible();
  }

  async expectRemoveButton(productName: string) {
    await expect(this.item(productName).locator(this.removeButton)).toBeVisible();
  }

  // 商品詳細画面へ移ったことを確かめる（画面の中身は確かめない）
  async expectOnProductDetailPage(productId: number) {
    await expect(this.page).toHaveURL(`${urls.inventoryItem}?id=${productId}`);
  }
}

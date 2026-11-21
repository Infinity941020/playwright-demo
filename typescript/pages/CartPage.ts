import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';
import { exactText } from '../utils/regExp';

// カート画面の操作と、画面の表示の確認をまとめる。
// - 商品ごとの部分（ボタン・価格など）は、商品名でカートの行を探してから、その中で探す
// - 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示の確認も呼ぶ
export class CartPage {

  private readonly page: Page;
  private readonly title: Locator;
  private readonly quantityLabel: Locator;
  private readonly descriptionLabel: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;
  private readonly cartItems: Locator;
  private readonly itemQuantities: Locator;
  private readonly itemNames: Locator;
  private readonly itemDescriptions: Locator;
  private readonly itemPrices: Locator;
  private readonly itemRemoveButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.title = page.locator('[data-test="title"]');
    this.quantityLabel = page.locator('[data-test="cart-quantity-label"]');
    this.descriptionLabel = page.locator('[data-test="cart-desc-label"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');

    // 削除した行は、見えない要素として画面に残るため、テスト用の属性で商品の行と決められている要素だけを数える
    this.cartItems = page.locator('[data-test="inventory-item"]');

    this.itemQuantities = page.locator('[data-test="item-quantity"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');

    // ボタンのテスト用の属性には商品ごとに違う名前が入るため、行の中でボタンの文言で探す
    this.itemRemoveButton = page.getByRole('button', { name: 'Remove', exact: true });
  }

  // 商品名が完全に一致するカートの行
  private item(productName: string): Locator {
    return this.cartItems.filter({ has: this.itemNames.filter({ hasText: exactText(productName) }) });
  }

  async goto() {
    await this.page.goto(urls.cart);
  }

  async reload() {
    await this.page.reload();
  }

  // カートの中身を、ブラウザの保存領域に直接書き込む（テストの前提の状態を作るために使う）。
  // SauceDemo が中で使っている保存名（cart-contents）と形（商品の番号の配列）に頼るため、書き込む処理はここだけに置く。
  // 保存領域はサイトごとに分かれるため、SauceDemo の画面を開いた状態で呼ぶ
  async setCartContents(productIds: number[]) {
    await this.page.evaluate(
      (value) => localStorage.setItem('cart-contents', value),
      JSON.stringify(productIds),
    );
  }

  async removeFromCart(productName: string) {
    await this.item(productName).locator(this.itemRemoveButton).click();
  }

  async clickContinueShopping() {
    await this.continueShoppingButton.click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async clickProductName(productName: string) {
    await this.item(productName).locator(this.itemNames).click();
  }

  // カート画面が表示されていることを確かめる。
  // URL が一致しても画面の描画がまだのことがあるため、この画面にしかない Continue Shopping ボタンが見えることも確かめる
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.cart);
    await expect(this.continueShoppingButton).toBeVisible();
  }

  // 商品の有無に関係なく表示される項目（タイトル・一覧の見出し・ボタン）を確かめる
  async expectPageLayout() {

    await expect(this.title).toHaveText('Your Cart');
    await expect(this.quantityLabel).toHaveText('QTY');
    await expect(this.descriptionLabel).toHaveText('Description');
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  // すべての行に、数量（1）・商品名・説明・価格・Remove ボタンが表示されていることを確かめる
  async expectAllItemElementsVisible() {

    // 行がまだ表示されていないと、何も確かめずに終わってしまうため、最初の行が表示されるのを待つ
    await expect(this.cartItems.first()).toBeVisible();

    for (const item of await this.cartItems.all()) {

      await expect(item.locator(this.itemQuantities)).toHaveText('1');
      await expect(item.locator(this.itemNames)).toBeVisible();
      await expect(item.locator(this.itemDescriptions)).toBeVisible();
      await expect(item.locator(this.itemPrices)).toBeVisible();
      await expect(item.locator(this.itemRemoveButton)).toBeVisible();
    }
  }

  async expectItemPrice(productName: string, price: string) {
    await expect(this.item(productName).locator(this.itemPrices)).toHaveText(price);
  }

  // 商品名が、渡した順に並んでいることを確かめる
  async expectItemNames(productNames: readonly string[]) {
    await expect(this.cartItems.locator(this.itemNames)).toHaveText(productNames);
  }

  async expectItemListed(productName: string) {
    await expect(this.item(productName)).toHaveCount(1);
  }
}

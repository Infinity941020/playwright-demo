import { Page } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { HeaderComponent } from '../pages/HeaderComponent';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckoutStepOnePage } from '../pages/CheckoutPage';
import { Product } from '../data/products';

// カート画面での操作と、その結果の確認を、利用者の操作の単位でまとめる。
// テストから画面の細かい操作を直接扱わずに済むようにする
export class CartFlow {

  private readonly cartPage: CartPage;
  private readonly header: HeaderComponent;

  // 操作の後に移る画面（商品一覧画面・商品詳細画面・Checkout Step One画面）の表示を確かめるために使う
  private readonly inventoryPage: InventoryPage;
  private readonly checkoutStepOnePage: CheckoutStepOnePage;

  constructor(page: Page) {

    this.cartPage = new CartPage(page);
    this.header = new HeaderComponent(page);
    this.inventoryPage = new InventoryPage(page);
    this.checkoutStepOnePage = new CheckoutStepOnePage(page);
  }

  // 渡した商品が、渡した順にカートに入った状態で、カート画面を開く。
  // 商品一覧画面での追加の不具合でカート画面のテストまで失敗しないように、ブラウザの保存領域へ直接書き込んで作る。
  // 保存領域はサイトごとに分かれるため、ログイン済みの画面（SauceDemo の画面を開いた状態）から呼ぶ
  async openCartWith(products: readonly Product[]) {

    await this.cartPage.setCartContents(products.map((product) => product.id));
    await this.cartPage.goto();
    await this.cartPage.expectOnPage();

    // 書き込みが効かずに空のカートのままテストが進まないように、行の数が入れた件数と同じことを確かめる
    await this.cartPage.expectItemCount(products.length);
  }

  // カート画面の URL を開く。ログインしていない状態で開こうとしたときの確認に使う。
  // カート画面が表示されるとは限らないため、表示は確かめない
  async accessCartDirectly() {
    await this.cartPage.goto();
  }

  // 再読み込みでログイン画面へ戻された場合などに、別の画面のまま確認を続けないよう、カート画面であることを確かめる
  async reloadCart() {

    await this.cartPage.reload();
    await this.cartPage.expectOnPage();
  }

  async removeFromCart(productName: string) {
    await this.cartPage.removeFromCart(productName);
  }

  async continueShopping() {
    await this.cartPage.clickContinueShopping();
  }

  async checkout() {
    await this.cartPage.clickCheckout();
  }

  async openProductDetail(productName: string) {
    await this.cartPage.clickProductName(productName);
  }

  // タイトル・一覧の見出し・Continue Shopping・Checkout が表示されていることを確かめる
  async expectCartPageLayout() {
    await this.cartPage.expectPageLayout();
  }

  async expectItemCount(count: number) {
    await this.cartPage.expectItemCount(count);
  }

  // カートの表示を確かめる（行数、各行の表示項目、商品名と価格の組み合わせ）
  async expectItemsDisplayed(products: readonly Product[]) {

    await this.cartPage.expectItemCount(products.length);
    await this.cartPage.expectAllItemElementsVisible();

    for (const product of products) {
      await this.cartPage.expectItemPrice(product.name, product.price);
    }
  }

  async expectItemNamesInOrder(productNames: readonly string[]) {
    await this.cartPage.expectItemNames(productNames);
  }

  // カートに、渡した商品の行があることを確かめる（並び順は問わない）
  async expectInCart(productName: string) {
    await this.cartPage.expectItemListed(productName);
  }

  async expectBadgeCount(count: number) {
    await this.header.expectBadgeCount(count);
  }

  async expectOnInventoryPage() {
    await this.inventoryPage.expectOnPage();
  }

  async expectOnCheckoutStepOnePage() {
    await this.checkoutStepOnePage.expectOnPage();
  }

  async expectOnProductDetailPage(productId: number) {
    await this.inventoryPage.expectOnProductDetailPage(productId);
  }
}

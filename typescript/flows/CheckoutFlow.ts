import { Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { HeaderComponent } from '../pages/HeaderComponent';
import {
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  CheckoutCompletePage,
} from '../pages/CheckoutPage';
import { Product } from '../data/products';

// Checkout の画面での操作と、その結果の確認を、利用者の操作の単位でまとめる。
// テストから画面の細かい操作を直接扱わずに済むようにする
export class CheckoutFlow {

  private readonly stepOne: CheckoutStepOnePage;
  private readonly stepTwo: CheckoutStepTwoPage;
  private readonly complete: CheckoutCompletePage;
  private readonly header: HeaderComponent;

  // 前提の状態を作るためと、操作の後に移るカート画面の表示を確かめるために使う
  private readonly cart: CartPage;

  // 操作の後に移る商品一覧画面の表示を確かめるためと、Step Two・Complete のテストの前提を作るために使う
  private readonly inventory: InventoryPage;

  constructor(page: Page) {

    this.stepOne = new CheckoutStepOnePage(page);
    this.stepTwo = new CheckoutStepTwoPage(page);
    this.complete = new CheckoutCompletePage(page);
    this.header = new HeaderComponent(page);
    this.cart = new CartPage(page);
    this.inventory = new InventoryPage(page);
  }

  // 渡した商品がカートに入った状態で、Checkout Step One画面を URL で開く。
  // カートの中身は、ブラウザの保存領域へ直接書き込んで作る。
  // 保存領域はサイトごとに分かれるため、ログイン済みの画面（SauceDemo の画面を開いた状態）から呼ぶ
  async openStepOneWith(products: readonly Product[]) {

    await this.cart.setCartContents(products.map((product) => product.id));
    await this.stepOne.goto();
    await this.stepOne.expectOnPage();

    // この画面には商品の行がなく、カートが空でも先へ進めるため、書き込みが効いたことをバッジの件数で確かめる
    await this.header.expectBadgeCount(products.length);
  }

  // Checkout Step One画面の URL を開く。ログインしていない状態で開こうとしたときの確認に使う。
  // Checkout Step One画面が表示されるとは限らないため、表示は確かめない
  async accessStepOneDirectly() {
    await this.stepOne.goto();
  }

  // 再読み込みでログイン画面へ戻された場合などに、別の画面のまま確認を続けないよう、Checkout Step One画面であることを確かめる
  async reloadStepOne() {

    await this.stepOne.reload();
    await this.stepOne.expectOnPage();
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.stepOne.fillInfo(firstName, lastName, postalCode);
  }

  // Continue を押す（入力が足りないときは、画面は移らない）
  async proceedToOverviewStep() {
    await this.stepOne.clickContinue();
  }

  async cancelFromStepOne() {
    await this.stepOne.clickCancel();
  }

  async closeError() {
    await this.stepOne.closeError();
  }

  async openCart() {
    await this.header.clickCartIcon();
  }

  async expectOnStepOnePage() {
    await this.stepOne.expectOnPage();
  }

  // 画面の項目を確かめる。バッジは含まない（ヘッダーの確認で行う）
  async expectStepOnePageLayout() {
    await this.stepOne.expectPageLayout();
  }

  async expectErrorMessage(message: string) {
    await this.stepOne.expectErrorMessage(message);
  }

  async expectNoError() {
    await this.stepOne.expectNoError();
  }

  async expectInfoValues(firstName: string, lastName: string, postalCode: string) {
    await this.stepOne.expectInfoValues(firstName, lastName, postalCode);
  }

  async expectBadgeCount(count: number) {
    await this.header.expectBadgeCount(count);
  }

  async expectOnStepTwoPage() {
    await this.stepTwo.expectOnPage();
  }

  async expectOnCartPage() {
    await this.cart.expectOnPage();
  }

  async expectCartItemCount(count: number) {
    await this.cart.expectItemCount(count);
  }

  // カートに、渡した商品の行があることを確かめる（並び順は問わない）
  async expectInCart(productName: string) {
    await this.cart.expectItemListed(productName);
  }

  // 以下は Step Two・Complete のテストが使う

  async addSingleItem() {

    await this.inventory.expectOnPage();
    await this.inventory.addFirstItem();
  }

  async addMultipleItems() {

    await this.inventory.expectOnPage();
    await this.inventory.addAllItems();
  }

  async addItems(type: 'single' | 'multi' = 'single') {

    if (type === 'single') {
      await this.addSingleItem();
    } else {
      await this.addMultipleItems();
    }
  }

  async goToCart() {

    await this.cart.goto();
    await this.cart.expectOnPage();
  }

  async startCheckout() {

    await this.cart.clickCheckout();
    await this.stepOne.expectOnPage();
  }

  // Continue を押した後に Step Two へ移ったことを、ここで確かめてから Finish を押す
  async completePurchase() {

    await this.stepTwo.expectOnPage();
    await this.stepTwo.clickFinish();
    await this.complete.expectOnPage();
  }

  // Step One と Step Two の Cancel は同じテスト用の属性を持つため、押す前に Step Two へ移っていることを確かめる
  async cancelFromStepTwo() {

    await this.stepTwo.expectOnPage();
    await this.stepTwo.clickCancel();
    await this.inventory.expectOnPage();
  }

  async verifyOrderComplete() {

    await this.complete.expectOnPage();
    await this.complete.expectCompleteHeaderVisible();
  }
}

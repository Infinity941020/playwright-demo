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
import { CheckoutInfo } from '../data/checkoutData';

// Checkout の画面での操作と、その結果の確認を、利用者の操作の単位でまとめる。
// - ボタンやアイコンを押す操作は、移った先の画面を確かめないので、確かめるときは呼び出す側で表示を確かめる処理も呼ぶ
// - 前提の状態を作る操作は、開いた画面が表示されたことまで確かめる
export class CheckoutFlow {

  private readonly stepOne: CheckoutStepOnePage;
  private readonly stepTwo: CheckoutStepTwoPage;
  private readonly complete: CheckoutCompletePage;
  private readonly header: HeaderComponent;

  // 前提の状態を作るためと、操作の後に移るカート画面の表示を確かめるために使う
  private readonly cart: CartPage;

  // 操作の後に移る画面（商品一覧画面・商品詳細画面）の表示を確かめるために使う
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

  // 渡した商品がカートに入った状態で、Step One から購入者情報を入れて Continue を押し、Checkout Step Two画面を開く。
  // Step Two の URL を直接開けることは、意図された仕様か不具合かを判断できない挙動のため、前提づくりでは使わない
  async openStepTwoWith(products: readonly Product[], checkoutInfo: CheckoutInfo) {

    await this.openStepOneWith(products);
    await this.fillCheckoutInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await this.proceedToOverviewStep();
    await this.stepTwo.expectOnPage();
  }

  // Checkout Step Two画面の URL を開く。ログインしていない状態で開こうとしたときの確認に使う。
  // Checkout Step Two画面が表示されるとは限らないため、表示は確かめない
  async accessStepTwoDirectly() {
    await this.stepTwo.goto();
  }

  // 再読み込みでログイン画面へ戻された場合などに、別の画面のまま確認を続けないよう、Checkout Step Two画面であることを確かめる
  async reloadStepTwo() {

    await this.stepTwo.reload();
    await this.stepTwo.expectOnPage();
  }

  // Finish を押して購入を確定する
  async completePurchase() {
    await this.stepTwo.clickFinish();
  }

  async cancelFromStepTwo() {
    await this.stepTwo.clickCancel();
  }

  async openProductDetail(productName: string) {
    await this.stepTwo.clickProductName(productName);
  }

  async expectOnStepTwoPage() {
    await this.stepTwo.expectOnPage();
  }

  // 画面の項目を確かめる。商品の行と金額、バッジは含まない（それぞれ別の確認で行う）
  async expectStepTwoPageLayout() {
    await this.stepTwo.expectPageLayout();
  }

  // 商品の表示を確かめる（行数、各行の表示項目、商品名と価格の組み合わせ）
  async expectStepTwoItemsDisplayed(products: readonly Product[]) {

    await this.stepTwo.expectItemCount(products.length);
    await this.stepTwo.expectAllItemElementsVisible();

    for (const product of products) {
      await this.stepTwo.expectItemPrice(product.name, product.price);
    }
  }

  async expectStepTwoItemNamesInOrder(productNames: readonly string[]) {
    await this.stepTwo.expectItemNames(productNames);
  }

  async expectStepTwoItemCount(count: number) {
    await this.stepTwo.expectItemCount(count);
  }

  // 渡した商品の行があることを確かめる（並び順は問わない）
  async expectStepTwoItemListed(productName: string) {
    await this.stepTwo.expectItemListed(productName);
  }

  async expectStepTwoAmounts(itemTotal: string, tax: string, total: string) {
    await this.stepTwo.expectAmounts(itemTotal, tax, total);
  }

  // 渡した商品がカートに入った状態から、Step One・Step Two を経て購入を完了し、Checkout Complete画面を開く。
  // Complete の URL を直接開けることは、意図された仕様か不具合かを判断できない挙動のため、前提づくりでは使わない
  async openCompleteWith(products: readonly Product[], checkoutInfo: CheckoutInfo) {

    await this.openStepTwoWith(products, checkoutInfo);
    await this.completePurchase();
    await this.complete.expectOnPage();
  }

  // Checkout Complete画面の URL を開く。ログインしていない状態で開こうとしたときの確認に使う。
  // Checkout Complete画面が表示されるとは限らないため、表示は確かめない
  async accessCompleteDirectly() {
    await this.complete.goto();
  }

  async backHome() {
    await this.complete.clickBackHome();
  }

  async expectOnCompletePage() {
    await this.complete.expectOnPage();
  }

  // 画面の項目を確かめる。バッジは含まない（ヘッダーの確認で行う）
  async expectCompletePageLayout() {
    await this.complete.expectPageLayout();
  }

  async expectOnInventoryPage() {
    await this.inventory.expectOnPage();
  }

  async expectOnProductDetailPage(productId: number) {
    await this.inventory.expectOnProductDetailPage(productId);
  }
}

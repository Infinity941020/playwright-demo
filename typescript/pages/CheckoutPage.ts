import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';
import { exactText } from '../utils/regExp';

// Checkout の3つの画面（Step One・Step Two・Complete）の操作と、画面の表示の確認を、画面ごとのクラスでまとめる。
// 画面を開く操作は表示を確かめないので、確かめるときは呼び出す側で表示の確認も呼ぶ

// Checkout Step One画面（購入者情報の入力）
export class CheckoutStepOnePage {

  private readonly page: Page;
  private readonly title: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly cancelButton: Locator;
  private readonly continueButton: Locator;
  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error-button"]');
  }

  async goto() {
    await this.page.goto(urls.checkoutStepOne);
  }

  async reload() {
    await this.page.reload();
  }

  // 購入者情報を入力する（空文字を渡すと、その欄は空欄になる）
  async fillInfo(firstName: string, lastName: string, postalCode: string) {

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  // 入力欄で Enter キーを押すと Continue ではなく Cancel が動くため、必ずボタンを押す
  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async closeError() {
    await this.errorCloseButton.click();
  }

  // Checkout Step One画面が表示されていることを確かめる。
  // URL が一致しても画面の描画がまだのことがあるため、この画面にしかない Continue ボタンが見えることも確かめる
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.checkoutStepOne);
    await expect(this.continueButton).toBeVisible();
  }

  // 仕様書の項目一覧のうち、画面タイトル・3つの入力欄のプレースホルダー・2つのボタンを確かめる
  async expectPageLayout() {

    await expect(this.title).toHaveText('Checkout: Your Information');
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.firstNameInput).toHaveAttribute('placeholder', 'First Name');
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.lastNameInput).toHaveAttribute('placeholder', 'Last Name');
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.postalCodeInput).toHaveAttribute('placeholder', 'Zip/Postal Code');
    await expect(this.cancelButton).toBeVisible();
    await expect(this.cancelButton).toHaveText('Cancel');

    // Continue は、文言を要素の中の文字ではなく値として持つ作りのため、値で確かめる
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toHaveValue('Continue');
  }

  // エラーの文言の全体が、渡した文言と一致することを確かめる（空白の数や前後の空白の違いは区別しない）
  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toHaveText(message);
  }

  // エラー表示の要素そのものが画面にないことを確かめる
  async expectNoError() {
    await expect(this.errorMessage).toHaveCount(0);
  }

  async expectInfoValues(firstName: string, lastName: string, postalCode: string) {

    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.postalCodeInput).toHaveValue(postalCode);
  }
}

// Checkout Step Two画面（注文内容の確認）
export class CheckoutStepTwoPage {

  private readonly page: Page;
  private readonly title: Locator;
  private readonly quantityLabel: Locator;
  private readonly descriptionLabel: Locator;
  private readonly items: Locator;
  private readonly itemQuantities: Locator;
  private readonly itemNames: Locator;
  private readonly itemDescriptions: Locator;
  private readonly itemPrices: Locator;
  private readonly paymentLabel: Locator;
  private readonly paymentValue: Locator;
  private readonly shippingLabel: Locator;
  private readonly shippingValue: Locator;
  private readonly priceTotalLabel: Locator;
  private readonly itemTotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;
  private readonly cancelButton: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.title = page.locator('[data-test="title"]');
    this.quantityLabel = page.locator('[data-test="cart-quantity-label"]');
    this.descriptionLabel = page.locator('[data-test="cart-desc-label"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemQuantities = page.locator('[data-test="item-quantity"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemDescriptions = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.paymentLabel = page.locator('[data-test="payment-info-label"]');
    this.paymentValue = page.locator('[data-test="payment-info-value"]');
    this.shippingLabel = page.locator('[data-test="shipping-info-label"]');
    this.shippingValue = page.locator('[data-test="shipping-info-value"]');
    this.priceTotalLabel = page.locator('[data-test="total-info-label"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  // 商品名が完全に一致する商品の行
  private item(productName: string): Locator {
    return this.items.filter({ has: this.itemNames.filter({ hasText: exactText(productName) }) });
  }

  async goto() {
    await this.page.goto(urls.checkoutStepTwo);
  }

  async reload() {
    await this.page.reload();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickProductName(productName: string) {
    await this.item(productName).locator(this.itemNames).click();
  }

  // Checkout Step Two画面が表示されていることを確かめる。
  // URL が一致しても画面の描画がまだのことがあるため、この画面にしかない Finish ボタンが見えることも確かめる
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.checkoutStepTwo);
    await expect(this.finishButton).toBeVisible();
  }

  // 仕様書の項目一覧のうち、商品の行と金額を除く項目（タイトル・一覧の見出し・支払いと配送の情報・金額の見出し・2つのボタン）を確かめる
  async expectPageLayout() {

    await expect(this.title).toHaveText('Checkout: Overview');
    await expect(this.quantityLabel).toHaveText('QTY');
    await expect(this.descriptionLabel).toHaveText('Description');
    await expect(this.paymentLabel).toHaveText('Payment Information:');
    await expect(this.paymentValue).toHaveText('SauceCard #31337');
    await expect(this.shippingLabel).toHaveText('Shipping Information:');
    await expect(this.shippingValue).toHaveText('Free Pony Express Delivery!');
    await expect(this.priceTotalLabel).toHaveText('Price Total');
    await expect(this.cancelButton).toBeVisible();
    await expect(this.cancelButton).toHaveText('Cancel');
    await expect(this.finishButton).toBeVisible();
    await expect(this.finishButton).toHaveText('Finish');
  }

  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }

  // すべての行に、数量（1）・商品名・説明・価格が表示されていることを確かめる
  async expectAllItemElementsVisible() {

    // 行がまだ表示されていないと、何も確かめずに終わってしまうため、最初の行が表示されるのを待つ
    await expect(this.items.first()).toBeVisible();

    for (const item of await this.items.all()) {

      await expect(item.locator(this.itemQuantities)).toHaveText('1');
      await expect(item.locator(this.itemNames)).toBeVisible();
      await expect(item.locator(this.itemDescriptions)).toBeVisible();
      await expect(item.locator(this.itemPrices)).toBeVisible();
    }
  }

  async expectItemPrice(productName: string, price: string) {
    await expect(this.item(productName).locator(this.itemPrices)).toHaveText(price);
  }

  // 商品名が、渡した順に並んでいることを確かめる
  async expectItemNames(productNames: readonly string[]) {
    await expect(this.items.locator(this.itemNames)).toHaveText(productNames);
  }

  async expectItemListed(productName: string) {
    await expect(this.item(productName)).toHaveCount(1);
  }

  // 小計・税・合計の表示の文言の全体を確かめる（空白の数や前後の空白の違いは区別しない）
  async expectAmounts(itemTotal: string, tax: string, total: string) {

    await expect(this.itemTotal).toHaveText(itemTotal);
    await expect(this.tax).toHaveText(tax);
    await expect(this.total).toHaveText(total);
  }
}

// Checkout Complete画面（購入完了）
export class CheckoutCompletePage {

  private readonly page: Page;
  private readonly title: Locator;
  private readonly header: Locator;
  private readonly text: Locator;
  private readonly image: Locator;
  private readonly backHomeButton: Locator;
  private readonly generatePdfButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.title = page.locator('[data-test="title"]');
    this.header = page.locator('[data-test="complete-header"]');
    this.text = page.locator('[data-test="complete-text"]');
    this.image = page.locator('[data-test="pony-express"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.generatePdfButton = page.locator('[data-test="generate-pdf-order"]');
  }

  async goto() {
    await this.page.goto(urls.complete);
  }

  async clickBackHome() {
    await this.backHomeButton.click();
  }

  // Checkout Complete画面が表示されていることを確かめる。
  // URL が一致しても画面の描画がまだのことがあるため、この画面にしかない Back Home ボタンが見えることも確かめる
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.complete);
    await expect(this.backHomeButton).toBeVisible();
  }

  // 仕様書の項目一覧のうち、カートアイコンを除く項目（タイトル・見出し・本文・画像・2つのボタン）を確かめる
  async expectPageLayout() {

    await expect(this.title).toHaveText('Checkout: Complete!');
    await expect(this.header).toHaveText('Thank you for your order!');
    await expect(this.text).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');

    // 画像の読み込みの遅れは、意図された仕様か不具合かを判断できない挙動のため、読み込みの完了ではなく、表示と代替テキストを確かめる
    await expect(this.image).toBeVisible();
    await expect(this.image).toHaveAttribute('alt', 'Pony Express');
    await expect(this.backHomeButton).toBeVisible();
    await expect(this.backHomeButton).toHaveText('Back Home');
    await expect(this.generatePdfButton).toBeVisible();
    await expect(this.generatePdfButton).toHaveText('Generate PDF order');
  }
}

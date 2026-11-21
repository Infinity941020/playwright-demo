import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';

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

  // 購入者情報を入力する（空の文字を渡すと、その欄は空欄になる）
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

  // Checkout Step One画面が表示されていることを確かめる（URL が完全に一致し、Continue ボタンが見えている）
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.checkoutStepOne);
    await expect(this.continueButton).toBeVisible();
  }

  // タイトル・3つの入力欄（入力の見本の文字）・ボタンを確かめる
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

    // Continue は入力欄の部品でできているため、文言は表示の文字ではなく値で確かめる
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toHaveValue('Continue');
  }

  // エラーの文言の全体が、渡した文言と一致することを確かめる（前後の空白などの違いは区別しない）
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

/*
================================
CheckoutStepTwoPage（購入内容の確認画面）
================================
*/
export class CheckoutStepTwoPage {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ Cancel・Finishボタン
  // ================================
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  // ================================
  // Checkout Step Two画面へ遷移
  // （表示の確認は、呼び出す側で expectOnPage() を呼んで行う）
  // ================================
  async goto() {

    await this.page.goto(urls.checkoutStepTwo);
  }

  // ================================
  // Finishボタン押下
  // ================================
  async clickFinish() {

    await this.finishButton.click();
  }

  // ================================
  // Cancelボタン押下
  // ================================
  async clickCancel() {

    await this.cancelButton.click();
  }

  // ================================
  // Checkout Step Two画面表示確認
  // ================================
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.checkoutStepTwo);
    await expect(this.finishButton).toBeVisible();
  }
}

/*
================================
CheckoutCompletePage（購入完了画面）
================================
*/
export class CheckoutCompletePage {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ 完了メッセージ（見出し）
  // ================================
  readonly completeHeader: Locator;

  // ================================
  // ■ Back Homeボタン
  // ================================
  readonly backHomeButton: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // ================================
  // Checkout Complete画面へ遷移
  // （表示の確認は、呼び出す側で expectOnPage() を呼んで行う）
  // ================================
  async goto() {

    await this.page.goto(urls.complete);
  }

  // ================================
  // Checkout Complete画面表示確認
  // ================================
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.complete);
    await expect(this.backHomeButton).toBeVisible();
  }

  // ================================
  // 完了メッセージ表示確認
  // ================================
  async expectCompleteHeaderVisible() {

    await expect(this.completeHeader).toBeVisible();
  }
}

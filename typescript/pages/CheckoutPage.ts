import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../utils/urls';

/*
================================
Checkout画面の Page Object
責務：
- 要素取得
- 単体操作（ボタンを押す・入力する。押した後の画面の確認はしない）
- 画面レベルの検証
================================
Python版の pages/checkout_page.py と1対1で対応するファイルで、クラスは画面ごとに分ける
（decisions.md 論点16）。
「Checkout を始める」（カート画面の Checkout ボタン）は CartPage にある。
*/

/*
================================
CheckoutStepOnePage（購入者情報の入力画面）
================================
*/
export class CheckoutStepOnePage {

  // ================================
  // ■ ページインスタンス
  // ================================
  readonly page: Page;

  // ================================
  // ■ 入力フィールド（名・姓・郵便番号）
  // ================================
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;

  // ================================
  // ■ Cancel・Continueボタン
  // ================================
  readonly cancelButton: Locator;
  readonly continueButton: Locator;

  // ================================
  // ■ エラーメッセージ表示エリア
  // ================================
  readonly errorMessageLocator: Locator;

  // ================================
  // コンストラクタ
  // ================================
  constructor(page: Page) {

    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  // ================================
  // Checkout Step One画面へ遷移
  // （表示の確認は、呼び出す側で expectOnPage() を呼んで行う）
  // ================================
  async goto() {

    await this.page.goto(urls.checkoutStepOne);
  }

  // ================================
  // 購入者情報入力
  // ================================
  async fillInfo(first: string, last: string, zip: string) {

    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(zip);
  }

  // ================================
  // Continueボタン押下
  // ================================
  async clickContinue() {

    await this.continueButton.click();
  }

  // ================================
  // Cancelボタン押下
  // ================================
  async clickCancel() {

    await this.cancelButton.click();
  }

  // ================================
  // Checkout Step One画面表示確認
  // ================================
  async expectOnPage() {

    await expect(this.page).toHaveURL(urls.checkoutStepOne);
    await expect(this.continueButton).toBeVisible();
  }

  // ================================
  // エラー表示検証
  // ================================
  async expectErrorVisible() {

    await expect(this.errorMessageLocator).toBeVisible();
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

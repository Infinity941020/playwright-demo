import { Page, expect } from '@playwright/test';

/*
================================
CheckoutPage（CI安定版）
================================
*/
export class CheckoutPage {
  constructor(private page: Page) {}

  /*
  ================================
  Checkout開始
  ================================
  */
  async startCheckout() {

    // Checkoutボタンが表示されていることを確認
    await expect(this.page.locator('#checkout')).toBeVisible();

    // Checkoutボタン押下
    await this.page.locator('#checkout').click();

    // Step1画面へ遷移確認
    await expect(this.page).toHaveURL(/checkout-step-one/);

    // 入力欄表示確認
    await expect(this.page.locator('[data-test="firstName"]'))
      .toBeVisible();
  }

  /*
  ================================
  入力処理
  ================================
  */
  async fillInfo(first: string, last: string, zip: string) {

    // First Name入力欄表示確認
    await expect(this.page.locator('[data-test="firstName"]'))
      .toBeVisible();

    // First Name入力
    await this.page.fill('[data-test="firstName"]', first);

    // Last Name入力
    await this.page.fill('[data-test="lastName"]', last);

    // Postal Code入力
    await this.page.fill('[data-test="postalCode"]', zip);
  }

  /*
  ================================
  次へ進む（正常系）
  ================================
  */
  async continue() {

    // Continueボタン表示確認
    await expect(this.page.locator('[data-test="continue"]'))
      .toBeVisible();

    // Continue押下
    await this.page.locator('[data-test="continue"]').click();

    // Step2画面へ遷移確認
    await expect(this.page).toHaveURL(/checkout-step-two/);

    // Finishボタン表示確認
    await expect(this.page.locator('[data-test="finish"]'))
      .toBeVisible();
  }

  /*
  ================================
  次へ進む（異常系）
  ================================
  */
  async continueExpectError() {

    // Continueボタン表示確認
    await expect(this.page.locator('[data-test="continue"]'))
      .toBeVisible();

    // Continue押下
    await this.page.locator('[data-test="continue"]').click();

    // Step1画面に残る確認
    await expect(this.page).toHaveURL(/checkout-step-one/);

    // エラーメッセージ確認
    await expect(this.page.locator('[data-test="error"]'))
      .toBeVisible();
  }

  /*
  ================================
  購入確定
  ================================
  */
  async finish() {

    // Finishボタン表示確認
    await expect(this.page.locator('[data-test="finish"]'))
      .toBeVisible();

    // Finish押下
    await this.page.locator('[data-test="finish"]').click();

    // 完了画面URL確認
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  /*
  ================================
  キャンセル
  ================================
  */
  async cancel() {

    // Cancelボタン表示確認
    await expect(this.page.locator('[data-test="cancel"]'))
      .toBeVisible();

    // Cancel押下
    await this.page.locator('[data-test="cancel"]').click();

    // カートまたは一覧画面へ戻る確認
    await expect(this.page).toHaveURL(/cart|inventory/);
  }

  /*
  ================================
  Step1画面確認
  ================================
  */
  async expectOnStepOne() {

    // Step1画面URL確認
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  /*
  ================================
  Step2画面確認
  ================================
  */
  async expectOnStepTwo() {

    // Step2画面URL確認
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  /*
  ================================
  完了画面確認
  ================================
  */
  async expectComplete() {

    // 完了画面URL確認
    await expect(this.page).toHaveURL(/checkout-complete/);

    // 完了メッセージ確認
    await expect(this.page.locator('.complete-header'))
      .toBeVisible();
  }

  /*
  ================================
  購入一括実行
  ================================
  */
  async completePurchase(
    first: string,
    last: string,
    zip: string
  ) {

    // Checkout開始
    await this.startCheckout();

    // 入力処理
    await this.fillInfo(first, last, zip);

    // 次へ進む
    await this.continue();

    // 購入完了
    await this.finish();
  }
}
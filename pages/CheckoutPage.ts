// Playwright Page型を使用
import { Page, expect } from '@playwright/test';

/*
================================
Checkoutフロー管理Page Object（実務設計版）
================================
責務：
- Checkoutフローの状態遷移を一元管理
- specからDOM操作を排除
================================
*/

export class CheckoutPage {
  constructor(private page: Page) {}

  /*
  ================================
  ① Checkout開始（Cart → Step1）
  ================================
  */
  async startCheckout() {
    const checkoutBtn = this.page.locator('#checkout');

    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // Step1遷移保証
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  /*
  ================================
  ② Checkout入力
  ================================
  */
  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.page.fill('[data-test="firstName"]', firstName);
    await this.page.fill('[data-test="lastName"]', lastName);
    await this.page.fill('[data-test="postalCode"]', postalCode);
  }

  /*
  ================================
  ③ Step1 → Step2へ進む
  ================================
  */
  async continue() {
    const continueBtn = this.page.locator('[data-test="continue"]');

    await expect(continueBtn).toBeVisible();
    await continueBtn.click();

    // Step2遷移保証
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  /*
  ================================
  ④ 購入確定
  ================================
  */
  async finish() {
    const finishBtn = this.page.locator('[data-test="finish"]');

    await expect(finishBtn).toBeVisible();
    await finishBtn.click();

    // 完了画面確認
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  /*
  ================================
  ⑤ Cancel（Step1 / Step2共通）
  ================================
  */
  async cancel() {
    const cancelBtn = this.page.locator('[data-test="cancel"]');

    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // カートへ戻る保証
    await expect(this.page).toHaveURL(/cart/);
  }

  /*
  ================================
  ⑥ フル購入フロー（便利メソッド）
  ================================
  */
  async completePurchase(data: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }) {
    await this.startCheckout();
    await this.fillInfo(data.firstName, data.lastName, data.postalCode);
    await this.continue();
    await this.finish();
  }

  /*
  ================================
  ⑦ 状態確認系
  ================================
  */
  async expectOnStepOne() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async expectOnStepTwo() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async expectComplete() {
    await expect(this.page).toHaveURL(/checkout-complete/);
  }
}
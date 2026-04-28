// PlaywrightのPage型・expectを使用
import { Page, expect } from '@playwright/test';

/*
================================
CheckoutPage（Flow最終安定版）
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

    await expect(this.page.locator('#checkout')).toBeVisible();
    await this.page.locator('#checkout').click();

    await expect(this.page).toHaveURL(/checkout-step-one/);

    await expect(this.page.locator('[data-test="firstName"]'))
      .toBeVisible();
  }

  /*
  ================================
  入力
  ================================
  */
  async fillInfo(first: string, last: string, zip: string) {

    await expect(this.page.locator('[data-test="firstName"]'))
      .toBeVisible();

    await this.page.fill('[data-test="firstName"]', first);
    await this.page.fill('[data-test="lastName"]', last);
    await this.page.fill('[data-test="postalCode"]', zip);
  }

  /*
  ================================
  次へ（正常）
  ================================
  */
  async continue() {

    await expect(this.page.locator('[data-test="continue"]'))
      .toBeVisible();

    await this.page.locator('[data-test="continue"]').click();

    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  /*
  ================================
  次へ（異常）
  ================================
  */
  async continueExpectError() {

    await expect(this.page.locator('[data-test="continue"]'))
      .toBeVisible();

    await this.page.locator('[data-test="continue"]').click();

    await expect(this.page).toHaveURL(/checkout-step-one/);

    await expect(this.page.locator('[data-test="error"]'))
      .toBeVisible();
  }

  /*
  ================================
  完了
  ================================
  */
  async finish() {

    await expect(this.page.locator('[data-test="finish"]'))
      .toBeVisible();

    await this.page.locator('[data-test="finish"]').click();

    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  /*
  ================================
  キャンセル（Step1）
  ================================
  */
  async cancelFromStepOne() {

    const cancelBtn = this.page.locator(
      '[data-test="cancel"], #cancel'
    );

    await expect(cancelBtn.first()).toBeVisible();
    await cancelBtn.first().click();

    // Step1 → Cart
    await expect(this.page).toHaveURL(/cart/);
  }

  /*
  ================================
  キャンセル（Step2）
  ================================
  */
  async cancelFromStepTwo() {

    const cancelBtn = this.page.locator(
      '[data-test="cancel"], #cancel'
    );

    await expect(cancelBtn.first()).toBeVisible();
    await cancelBtn.first().click();

    // Step2 → Inventory
    await expect(this.page).toHaveURL(/inventory/);
  }

  /*
  ================================
  Step確認
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

    await expect(this.page.locator('.complete-header'))
      .toBeVisible();
  }
}
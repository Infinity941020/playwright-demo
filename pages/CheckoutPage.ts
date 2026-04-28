import { Page, expect } from '@playwright/test';

export class CheckoutPage {

  constructor(private page: Page) {}

  // =========================
  // Checkout開始
  // =========================
  async startCheckout() {

    const btn = this.page.locator('#checkout');

    await btn.click();

    // ★重要：URL変化を確実に待つ
    await this.page.waitForURL(/checkout-step-one/, {
      timeout: 10000
    });
  }

  // =========================
  // 入力
  // =========================
  async fillInfo(first: string, last: string, zip: string) {

    const firstName = this.page.locator('[data-test="firstName"]');
    const lastName = this.page.locator('[data-test="lastName"]');
    const postal = this.page.locator('[data-test="postalCode"]');

    await firstName.fill(first);
    await lastName.fill(last);
    await postal.fill(zip);
  }

  // =========================
  // 次へ（正常）
  // =========================
  async continue() {
    await this.page.locator('[data-test="continue"]').click();
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  // =========================
  // 次へ（異常）
  // =========================
  async continueExpectError() {
    await this.page.locator('[data-test="continue"]').click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
    await expect(this.page.locator('[data-test="error"]')).toBeVisible();
  }

  // =========================
  // 完了
  // =========================
  async finish() {
    await this.page.locator('[data-test="finish"]').click();
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  // =========================
  // キャンセル
  // =========================
  async cancelFromStepOne() {
    await this.page.locator('[data-test="cancel"], #cancel').first().click();
    await expect(this.page).toHaveURL(/cart/);
  }

  async cancelFromStepTwo() {
    await this.page.locator('[data-test="cancel"], #cancel').first().click();
    await expect(this.page).toHaveURL(/inventory/);
  }

  // =========================
  // assert
  // =========================
  async expectOnStepOne() {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async expectOnStepTwo() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async expectComplete() {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.page.locator('.complete-header')).toBeVisible();
  }
}
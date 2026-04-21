import { Page, expect } from '@playwright/test';

/*
========================================
CheckoutPage（完全リファクタ版）
========================================
*/

export class CheckoutPage {
  constructor(private page: Page) {}

  // ================================
  // 画面遷移
  // ================================

  async openCheckout() {
    await this.page.click('#checkout');
  }

  async continueShopping() {
    await this.page.click('#continue-shopping');
  }

  async cancelCheckout() {
    await this.page.click('#cancel');
  }

  async finishCheckout() {
    await this.page.click('#finish');
  }

  // ================================
  // 入力操作
  // ================================

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.page.fill('#first-name', firstName);
    await this.page.fill('#last-name', lastName);
    await this.page.fill('#postal-code', postalCode);
  }

  async continue() {
    await this.page.click('#continue');
  }

  // ================================
  // エラー・状態確認
  // ================================

  async expectErrorVisible() {
    await expect(this.page.locator('[data-test="error"]')).toBeVisible();
  }

  async expectOverviewVisible() {
    await expect(this.page.locator('.checkout_summary_container')).toBeVisible();
  }

  async expectComplete() {
    await expect(this.page.locator('.complete-header')).toBeVisible();
  }

  // ================================
  // フルフロー（重要）
  // ================================

  async completeCheckout(first: string, last: string, zip: string) {
    await this.openCheckout();
    await this.fillInfo(first, last, zip);
    await this.continue();
    await this.expectOverviewVisible();
    await this.finishCheckout();
    await this.expectComplete();
  }
}
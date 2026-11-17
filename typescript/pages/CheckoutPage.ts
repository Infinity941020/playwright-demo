import { Page, expect } from '@playwright/test';

/*
================================
CheckoutPage（CI安定版・統一設計）
責務：
- Checkout画面のUI操作
- 画面遷移・入力・完了操作
- 最小限の検証
================================
*/
export class CheckoutPage {

  // Playwrightページインスタンス
  constructor(private page: Page) {}

  // =========================
  // ■ Checkout開始（Cart → Step1）
  // =========================
  async startCheckout() {

    // Checkoutボタン取得
    const btn = this.page.locator('#checkout');

    // Checkout開始ボタン押下
    await btn.click();

    // Step1画面遷移確認
    await this.page.waitForURL(/checkout-step-one/, {
      timeout: 10000
    });
  }

  // =========================
  // ■ 情報入力（Step1）
  // =========================
  async fillInfo(first: string, last: string, zip: string) {

    // 各入力フィールド取得
    const firstName = this.page.locator('[data-test="firstName"]');
    const lastName = this.page.locator('[data-test="lastName"]');
    const postal = this.page.locator('[data-test="postalCode"]');

    // 入力処理
    await firstName.fill(first);
    await lastName.fill(last);
    await postal.fill(zip);
  }

  // =========================
  // ■ 次へ（正常系：Step1 → Step2）
  // =========================
  async continue() {

    // Continueボタン押下
    await this.page.locator('[data-test="continue"]').click();

    // Step2遷移確認
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  // =========================
  // ■ 次へ（異常系）
  // =========================
  async continueExpectError() {

    // Continueボタン押下
    await this.page.locator('[data-test="continue"]').click();

    // Step1に留まることを確認
    await expect(this.page).toHaveURL(/checkout-step-one/);

    // エラーメッセージ表示確認
    await expect(this.page.locator('[data-test="error"]')).toBeVisible();
  }

  // =========================
  // ■ 完了（Step2 → Complete）
  // =========================
  async finish() {

    // Finishボタン押下
    await this.page.locator('[data-test="finish"]').click();

    // 完了画面遷移確認
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  // =========================
  // ■ キャンセル（Step1 → Cart）
  // =========================
  async cancelFromStepOne() {

    // Cancelボタン押下
    await this.page.locator('[data-test="cancel"], #cancel').first().click();

    // カート画面遷移確認
    await expect(this.page).toHaveURL(/cart/);
  }

  // =========================
  // ■ キャンセル（Step2 → Inventory）
  // =========================
  async cancelFromStepTwo() {

    // Cancelボタン押下
    await this.page.locator('[data-test="cancel"], #cancel').first().click();

    // 商品一覧画面遷移確認
    await expect(this.page).toHaveURL(/inventory/);
  }

  // =========================
  // ■ 状態確認（Step1）
  // =========================
  async expectOnStepOne() {

    // Step1 URL確認
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  // =========================
  // ■ 状態確認（Step2）
  // =========================
  async expectOnStepTwo() {

    // Step2 URL確認
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  // =========================
  // ■ 完了状態確認
  // =========================
  async expectComplete() {

    // 完了画面URL確認
    await expect(this.page).toHaveURL(/checkout-complete/);

    // 完了メッセージ確認
    await expect(this.page.locator('.complete-header')).toBeVisible();
  }
}
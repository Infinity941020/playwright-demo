// PlaywrightのPage型を使用するためにインポート
import { Page, expect } from '@playwright/test';

// Checkout画面の操作をまとめたPage Object
export class CheckoutPage {

  // Pageインスタンスを保持
  constructor(private page: Page) {}

  // チェックアウト情報を入力する処理
  async fillInfo(firstName: string, lastName: string, postalCode: string) {

    // First Name入力欄に値を入力
    await this.page.fill('[data-test="firstName"]', firstName);

    // Last Name入力欄に値を入力
    await this.page.fill('[data-test="lastName"]', lastName);

    // Postal Code入力欄に値を入力
    await this.page.fill('[data-test="postalCode"]', postalCode);

    // Continueボタンをクリックして次へ進む
    await this.page.click('[data-test="continue"]');
  }

  // 購入完了まで進める処理（今回のmissingメソッド）
  async finish() {

    // Finishボタンが表示されるまで待機
    const finishButton = this.page.locator('[data-test="finish"]');

    // ボタン表示確認（安定化）
    await expect(finishButton).toBeVisible();

    // 購入完了ボタンをクリック
    await finishButton.click();
  }

}
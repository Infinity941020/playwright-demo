// PlaywrightのPage操作・Locator操作・expectを使うためのimport
import { Page, Locator, expect } from '@playwright/test';

// カート画面の操作をまとめたPage Objectクラス
export class CartPage {

  // PlaywrightのPageインスタンス（ブラウザ操作の本体）
  readonly page: Page;

  // PageObjectの初期化（テストからPageを受け取る）
  constructor(page: Page) {
    this.page = page;
  }

  // 1件目の商品をカートに追加する処理
  async addFirstItem() {
    await this.page.locator('.inventory_item button').first().click();
  }

  // 全商品をカートに追加する処理（件数も返す）
  async addAllItems(): Promise<number> {

    // 商品一覧のAddボタンをすべて取得
    const buttons = this.page.locator('.inventory_item button');

    // 商品数を取得
    const count = await buttons.count();

    // 全商品を順番にクリックしてカート追加
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }

    // 追加した商品数を返す（テスト側で検証用）
    return count;
  }

  // カート画面へ遷移する処理
  async goToCart() {
    await this.page.click('.shopping_cart_link');
  }

  // カート内の1件目を削除する処理
  async removeFirstItem() {
    await this.page.locator('button', { hasText: 'Remove' }).first().click();
  }

  // カート内の全商品を削除する処理
  async removeAllItems() {

    // Removeボタンをすべて取得
    const buttons = this.page.locator('button', { hasText: 'Remove' });

    // 削除対象の件数を取得
    const count = await buttons.count();

    // 全件削除（DOM変化するので毎回先頭をクリック）
    for (let i = 0; i < count; i++) {
      await this.page.locator('button', { hasText: 'Remove' }).first().click();
    }
  }

  // カートバッジ要素を取得する処理
  getBadge(): Locator {
    return this.page.locator('.shopping_cart_badge');
  }

  // カートバッジの表示数を取得する処理
  async getBadgeCount(): Promise<number> {

    // バッジのテキストを取得
    const text = await this.getBadge().textContent();

    // 数値に変換（null対策あり）
    return parseInt(text || '0');
  }

  // カートバッジの件数を検証する処理
  async expectBadgeCount(expected: number) {

    // バッジ要素を取得
    const badge = this.getBadge();

    // 0件の場合はバッジが存在しないことを確認
    if (expected === 0) {
      await expect(badge).toHaveCount(0);
      return;
    }

    // バッジが表示されていることを確認
    await expect(badge).toBeVisible();

    // 実際の件数を取得
    const count = await this.getBadgeCount();

    // 期待値と一致するか検証
    expect(count).toBe(expected);
  }
}
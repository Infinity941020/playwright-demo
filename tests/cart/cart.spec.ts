// Playwrightのテスト実行機能と検証機能を読み込み
import { test, expect } from '@playwright/test';

// ログイン画面操作クラスを読み込み
import { LoginPage } from '../../pages/LoginPage';

// ================================
// カート機能 E2Eテスト（パターン①〜④）
// ================================
test.describe('カート機能テスト', () => {

  // 共通ログイン処理（各テストで使い回し）
  const login = async (page: any) => {
    const loginPage = new LoginPage(page);

    // ログインページへ遷移
    await loginPage.goto();

    // 正常ユーザーでログイン
    await loginPage.login('standard_user', 'secret_sauce');

    // 商品一覧が表示されていること確認
    await expect(page.locator('.inventory_list')).toBeVisible();
  };

  // ================================
  // パターン①：単一商品追加
  // ================================
  test('パターン①：商品を1つカートに追加できること', async ({ page }) => {

    await login(page);

    // 最初の商品をカートに追加
    await page.locator('.inventory_item button').first().click();

    // カートバッジ表示確認（1件追加された証拠）
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
  });

  // ================================
  // パターン②：複数商品追加
  // ================================
  test('パターン②：複数商品をカートに追加できること', async ({ page }) => {

    await login(page);

    // 複数商品をカートに追加
    await page.locator('.inventory_item button').nth(0).click();
    await page.locator('.inventory_item button').nth(1).click();

    // カートバッジが表示されること確認
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
  });

  // ================================
  // パターン③：カート内容確認
  // ================================
  test('パターン③：カート内に商品が正しく入っていること', async ({ page }) => {

    await login(page);

    // 商品を追加
    await page.locator('.inventory_item button').first().click();

    // カート画面へ移動
    await page.click('.shopping_cart_link');

    // カート内に商品が表示されていること確認
    await expect(page.locator('.cart_item')).toBeVisible();
  });

  // ================================
  // パターン④：カートから削除
  // ================================
  test('パターン④：カートから商品を削除できること', async ({ page }) => {

    await login(page);

    // 商品を1つ追加
    await page.locator('.inventory_item button').first().click();

    // カートバッジ確認
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();

    // カートへ移動
    await page.click('.shopping_cart_link');

    // カートに商品があること確認
    await expect(page.locator('.cart_item')).toBeVisible();

    // Removeボタンで削除
    await page.locator('button', { hasText: 'Remove' }).click();

    // カートバッジが消えること確認
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

});
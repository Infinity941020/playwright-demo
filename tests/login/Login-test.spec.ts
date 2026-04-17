import { test, expect } from '@playwright/test';

test('ログインできること', async ({ page }) => {
  // ページにアクセス
  await page.goto('https://www.saucedemo.com/');

  // ユーザー名入力
  await page.fill('#user-name', 'standard_user');

  // パスワード入力
  await page.fill('#password', 'secret_sauce');

  // ログインボタンクリック
  await page.click('#login-button');

  // URLで遷移確認
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // 画面要素で確認（Productsって表示される）
  await expect(page.locator('.title')).toHaveText('Products');
});
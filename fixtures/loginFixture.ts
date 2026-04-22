import { test as base, expect, Page } from '@playwright/test';
import { urls } from '../utils/urls';

/*
================================
ログインFixture（型安全版）
================================
*/

type LoginFixture = {
  loggedPage: Page;
};

export const test = base.extend<LoginFixture>({
  loggedPage: async ({ page }, use: (page: Page) => Promise<void>) => {

    // ログイン画面へ遷移
    await page.goto(urls.login);

    // ユーザー名入力
    await page.locator('#user-name').fill('standard_user');

    // パスワード入力
    await page.locator('#password').fill('secret_sauce');

    // ログイン実行
    await page.locator('#login-button').click();

    // 商品一覧表示待ち（CI安定化）
    await expect(page.locator('.inventory_list')).toBeVisible();

    // テストへ渡す
    await use(page);
  }
});

export { expect };
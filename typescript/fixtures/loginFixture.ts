// Playwrightのfixture機能・Page型・expectを使用
import { test as base, Page, expect } from '@playwright/test';

/*
================================
ログインfixture（型安全・CI安定版）
================================
*/

// fixture型定義
type Fixtures = {

  // ログイン済みPage
  loggedPage: Page;
};

// fixture拡張
export const test = base.extend<Fixtures>({

  // ログイン済みPage生成
  loggedPage: async (
    { page }: { page: Page },
    use: (value: Page) => Promise<void>
  ) => {

    // ================================
    // ■ ログイン画面へ遷移
    // ================================
    await page.goto('https://www.saucedemo.com/');

    // ================================
    // ■ ログイン情報入力
    // ================================
    await page.fill(
      '[data-test="username"]',
      'standard_user'
    );

    await page.fill(
      '[data-test="password"]',
      'secret_sauce'
    );

    // ================================
    // ■ ログイン実行
    // ================================
    await page.click('[data-test="login-button"]');

    // ================================
    // ■ ログイン成功確認
    // ================================
    await expect(page).toHaveURL(/inventory/);

    // 商品一覧表示確認
    await expect(
      page.locator('.inventory_list')
    ).toBeVisible();

    // ログイン済みPageを返却
    await use(page);
  },
});

// expect再export
export { expect };
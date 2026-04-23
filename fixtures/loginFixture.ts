import { test as base, Page, expect } from '@playwright/test';

/*
================================
ログインfixture（型安全・CI安定版）
================================
*/

type Fixtures = {
  loggedPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedPage: async ({ page }: { page: Page }, use: (value: Page) => Promise<void>) => {

    // ログイン処理
    await page.goto('https://www.saucedemo.com/');

    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // ログイン済みページを渡す
    await use(page);
  },
});

export { expect };
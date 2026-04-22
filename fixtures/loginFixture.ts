import { test as base } from '@playwright/test';

type Fixtures = {
  login: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  login: async ({ page }, use) => {

    const login = async () => {
      await page.goto('https://www.saucedemo.com/');

      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
    };

    await use(login);
  },
});

export { expect } from '@playwright/test';
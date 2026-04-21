import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/*
========================================
認証状態セットアップ（安定版）
========================================
*/

setup('login and save storage state', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // ログイン状態保存
  await page.context().storageState({ path: 'auth.json' });
});
import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../../data/users';
import { STANDARD_USER_STORAGE_STATE } from '../../fixtures/loginFixture';

/*
========================================
認証状態セットアップ
========================================
playwright.config.ts の準備用のプロジェクト（setup）として、UI テストの前に1回だけ実行する。
standard_user でログインした状態（storageState）を保存し、loggedPage で再利用する
（decisions.md 論点1）。
*/

setup('login and save storage state', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);

  // 保存の前に、商品一覧画面が表示されていることを確認
  await loginPage.expectOnInventoryPage();

  // ログイン状態保存
  await page.context().storageState({ path: STANDARD_USER_STORAGE_STATE });
});

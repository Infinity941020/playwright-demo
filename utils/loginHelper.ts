// PlaywrightのPage型とexpect機能を使用するためimport
import { Page, expect } from '@playwright/test';

// 共通URL情報を読み込む
import { urls } from './urls';

// 共通ユーザー情報を読み込む
import { users } from '../data/users';

export async function login(page: Page) {

  // ログイン画面へ遷移
  await page.goto(urls.login);

  // ID入力
  await page.locator('#user-name').fill(users.standard.username);

  // PW入力
  await page.locator('#password').fill(users.standard.password);

  // ログイン実行
  await page.locator('#login-button').click();

  // 商品一覧確認
  await expect(page.locator('.inventory_list')).toBeVisible();
}
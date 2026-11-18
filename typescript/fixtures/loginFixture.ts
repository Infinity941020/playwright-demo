// Playwrightのfixture機能・Page型・expectを使用
import { test as base, Page, expect } from '@playwright/test';
import path from 'node:path';
import { urls } from '../utils/urls';

/*
================================
ログインfixture
================================
準備用のプロジェクト（setup。tests/setup/auth.setup.ts）が保存したログイン状態（storageState）を
再利用して、ログイン済みの Page を渡す（Python版の logged_page と同じ形。decisions.md 論点1）。

browser.newContext() で自分で context を作ると、config の video などの設定が効かないため、
storageState の設定を差し替えて、Playwright が作る page を使う
（context の作成とテスト後のクローズは Playwright が行う）。
差し替えは、この fixture の test を使うテストだけに効く。
*/

// ログイン状態の保存先（typescript/.gitignore で除外している）
export const STANDARD_USER_STORAGE_STATE = path.join(
  import.meta.dirname,
  '../playwright/.auth/standard_user.json'
);

// fixture型定義
type Fixtures = {

  // ログイン済みPage
  loggedPage: Page;
};

// fixture拡張
export const test = base.extend<Fixtures>({

  // 保存したログイン状態で、新しいブラウザの状態（context）を作る
  storageState: STANDARD_USER_STORAGE_STATE,

  // ログイン済みPage生成
  loggedPage: async (
    { page }: { page: Page },
    use: (value: Page) => Promise<void>
  ) => {

    // ================================
    // ■ 商品一覧画面へ遷移
    // ================================
    // storageState は Cookie などだけを復元し、開いていた画面までは復元しないため、明示的に開く
    await page.goto(urls.inventory);

    // ================================
    // ■ ログイン済みの確認
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

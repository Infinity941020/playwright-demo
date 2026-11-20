import { test as base, Browser, Page, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../data/users';

// ログイン済みの画面（商品一覧画面を開いた状態）をテストに渡す。
// - ログインした状態は、同時に動く担当ごと・ブラウザごとにファイルに保存して使い回す
// - saucedemo のログイン状態は約10分で切れるため、ファイルを作ってから一定時間を過ぎていたら、ログインし直して作り直す
// - この仕組みは、ここで作るテスト関数を使うテストだけに効く（ログインしていない状態から始めるテストには影響しない）

// 作り直すまでの時間（分）。期限の約10分より短くして余裕を持たせる。
// 確かめるときだけ、環境変数 STORAGE_STATE_MAX_AGE_MINUTES で一時的に短くできる
const DEFAULT_MAX_AGE_MINUTES = 8;

function storageStateMaxAgeMs(): number {

  const minutes = Number(process.env.STORAGE_STATE_MAX_AGE_MINUTES);

  return (Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_MAX_AGE_MINUTES) * 60 * 1000;
}

// ログインした状態のファイルがない、または古くなっていたら、ログインし直して作り直す（作り直しはここだけで行う）
async function ensureFreshStorageState(browser: Browser, fileName: string) {

  if (fs.existsSync(fileName)) {

    const ageMs = Date.now() - fs.statSync(fileName).mtimeMs;

    if (ageMs < storageStateMaxAgeMs()) {
      return;
    }
  }

  // テストで使う画面とは別に、ログインしていない一時的なブラウザの状態を作ってログインし、保存したら閉じる
  const context = await browser.newContext({ storageState: undefined });

  try {

    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectOnPage();
    await loginPage.login(users.standard.username, users.standard.password);

    // ログインに失敗した状態を保存しないように、保存の前に商品一覧画面が表示されていることを確かめる
    await new InventoryPage(page).expectOnPage();

    await context.storageState({ path: fileName });

  } finally {

    await context.close();
  }
}

type Fixtures = {
  loggedPage: Page;
};

type WorkerFixtures = {
  workerStorageStatePath: string;
};

export const test = base.extend<Fixtures, WorkerFixtures>({

  // 保存先は、同時に動く担当ごと・ブラウザごとに分ける（保存先のフォルダは .gitignore で管理の対象から外している）。
  // ブラウザごとに分けるのは、ブラウザによってクッキーの保存のされ方が違い、
  // WebKit が保存したものを Chromium では使えないため
  workerStorageStatePath: [async ({ browserName }, use) => {

    const id = test.info().parallelIndex;

    await use(path.join(import.meta.dirname, `../playwright/.auth/standard_user-${browserName}-${id}.json`));

  }, { scope: 'worker' }],

  // テストごとに、ログインした状態のファイルが新しいことを確かめてから（古ければ作り直してから）、そのファイルを使う。
  // 自分でブラウザの状態を作ると、録画などの設定が効かないため、Playwright が作るブラウザの状態に、このファイルを渡す
  storageState: async ({ browser, workerStorageStatePath }, use) => {

    await ensureFreshStorageState(browser, workerStorageStatePath);

    await use(workerStorageStatePath);
  },

  loggedPage: async (
    { page }: { page: Page },
    use: (value: Page) => Promise<void>
  ) => {

    const inventoryPage = new InventoryPage(page);

    // 保存したファイルからは、ログインした状態だけが戻り、開いていた画面は戻らないため、商品一覧画面を開く
    await inventoryPage.goto();
    await inventoryPage.expectOnPage();

    await use(page);
  },
});

export { expect };

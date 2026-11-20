import { test as base, Browser, Page, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginFlow } from '../flows/LoginFlow';
import { InventoryFlow } from '../flows/InventoryFlow';
import { users } from '../data/users';

// ログイン済みの画面（商品一覧画面を開いた状態）をテストに渡す。
// - ログインした状態（Cookie などの保存内容）は、テストを並列に実行する単位ごと・ブラウザごとにファイルに保存して使い回す
// - SauceDemo のログイン状態は約10分で切れるため、ファイルを作ってから一定時間を過ぎていたら、ログインし直して作り直す
// - この仕組みは、このファイルから読み込んだテストの定義を使うテストにだけ効く（ログインしていない状態から始めるテストには影響しない）

// 作り直すまでの時間（分）。期限の約10分より短くして余裕を持たせる。
// 作り直しの動きを確かめるときだけ、環境変数 STORAGE_STATE_MAX_AGE_MINUTES で一時的に短くできる
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

  // テストで使う閲覧環境とは切り離した、ログインしていない一時的な閲覧環境でログインし、保存したら閉じる
  const context = await browser.newContext({ storageState: undefined });

  try {

    const page = await context.newPage();

    await new LoginFlow(page).login(users.standard.username, users.standard.password);

    // ログインに失敗した状態を保存しないように、保存の前に商品一覧画面が表示されていることを確かめる
    await new InventoryFlow(page).expectOnInventoryPage();

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

  // 保存先は、テストを並列に実行する単位ごと・ブラウザごとに分ける（保存先のフォルダは .gitignore で管理の対象から外している）。
  // ブラウザごとに分けるのは、ブラウザによって Cookie の保存のされ方が違い、
  // WebKit が保存したものを Chromium では使えないため
  workerStorageStatePath: [async ({ browserName }, use) => {

    const id = test.info().parallelIndex;

    await use(path.join(import.meta.dirname, `../playwright/.auth/standard_user-${browserName}-${id}.json`));

  }, { scope: 'worker' }],

  // テストごとに、ログインした状態のファイルが新しいことを確かめてから（古ければ作り直してから）、そのファイルを使う。
  // 閲覧環境を自分で作ると、録画などの設定が効かないため、Playwright が作るテスト用の閲覧環境に、このファイルの保存内容を読み込ませる
  storageState: async ({ browser, workerStorageStatePath }, use) => {

    await ensureFreshStorageState(browser, workerStorageStatePath);

    await use(workerStorageStatePath);
  },

  loggedPage: async ({ page }, use) => {

    const inventoryFlow = new InventoryFlow(page);

    // 保存したファイルからは、ログインした状態だけが戻り、開いていた画面は戻らないため、商品一覧画面を開く
    await inventoryFlow.accessInventoryDirectly();
    await inventoryFlow.expectOnInventoryPage();

    await use(page);
  },
});

export { expect };

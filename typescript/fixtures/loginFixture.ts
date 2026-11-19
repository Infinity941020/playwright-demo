// Playwrightのfixture機能・Browser型・Page型・expectを使用
import { test as base, Browser, Page, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users } from '../data/users';

/*
================================
ログインfixture
================================
同時に動く担当（worker）ごとに、standard_user でログインした状態（storageState）のファイルを持ち、
それを使ってログイン済みの Page を渡す（Python版の logged_page と同じ形。decisions.md 論点1・27）。

- saucedemo のログイン状態（Cookie の session-username）は約10分で切れるため、
  テストごとにファイルを作ってからの時間を確かめ、一定時間を過ぎていたらログインし直して作り直す
- browser.newContext() で自分で context を作ると、config の video などの設定が効かないため、
  テストの page は、storageState の設定を差し替えて Playwright が作る page を使う
  （context の作成とテスト後のクローズは Playwright が行う）。
  差し替えは、この fixture の test を使うテストだけに効く
- 形は Playwright 公式ドキュメント（Authentication の「worker ごとにアカウントを使う」例）に沿い、
  時間の確認と作り直しを足している
*/

// ログイン状態のファイルを作り直すまでの時間（分）。
// 期限の約10分より短くして余裕を持たせる。確かめのときは環境変数 STORAGE_STATE_MAX_AGE_MINUTES で一時的に短くできる
const DEFAULT_MAX_AGE_MINUTES = 8;

function storageStateMaxAgeMs(): number {

  const minutes = Number(process.env.STORAGE_STATE_MAX_AGE_MINUTES);

  return (Number.isFinite(minutes) && minutes > 0 ? minutes : DEFAULT_MAX_AGE_MINUTES) * 60 * 1000;
}

/*
================================
ログイン状態のファイルを用意する（作り直しの処理はここだけ）
================================
ファイルがない、または作ってから一定時間を過ぎていたら、ログインし直してファイルを作り直す。
ログインは、テスト用の画面とは別の一時的なブラウザの状態（context）で行い、保存したら閉じる。
*/
async function ensureFreshStorageState(browser: Browser, fileName: string) {

  if (fs.existsSync(fileName)) {

    const ageMs = Date.now() - fs.statSync(fileName).mtimeMs;

    // まだ新しいファイルはそのまま使う
    if (ageMs < storageStateMaxAgeMs()) {
      return;
    }
  }

  // ログインしていない、きれいな状態の context を使う
  const context = await browser.newContext({ storageState: undefined });

  try {

    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectOnPage();
    await loginPage.login(users.standard.username, users.standard.password);

    // 保存の前に、商品一覧画面が表示されていることを確認
    await new InventoryPage(page).expectOnPage();

    // ログイン状態保存
    await context.storageState({ path: fileName });

  } finally {

    await context.close();
  }
}

// fixture型定義（テストごと）
type Fixtures = {

  // ログイン済みPage
  loggedPage: Page;
};

// fixture型定義（worker ごと）
type WorkerFixtures = {

  // この worker のログイン状態のファイルの場所
  workerStorageStatePath: string;
};

// fixture拡張
export const test = base.extend<Fixtures, WorkerFixtures>({

  // worker ごとのファイルの場所（typescript/.gitignore の playwright/.auth/ で除外している）。
  // ブラウザによって保存される Cookie の属性が違い（WebKit は sameSite: None・secure: false で保存し、
  // Chromium はそれを受け付けない）、別のブラウザが作ったファイルは使えないため、ブラウザ名もファイル名に含める
  workerStorageStatePath: [async ({ browserName }, use) => {

    const id = test.info().parallelIndex;

    await use(path.join(import.meta.dirname, `../playwright/.auth/standard_user-${browserName}-${id}.json`));

  }, { scope: 'worker' }],

  // テストごとに、ログイン状態のファイルが新しいことを確かめて（必要なら作り直して）から、
  // そのファイルでテスト用の context を作る
  storageState: async ({ browser, workerStorageStatePath }, use) => {

    await ensureFreshStorageState(browser, workerStorageStatePath);

    await use(workerStorageStatePath);
  },

  // ログイン済みPage生成
  loggedPage: async (
    { page }: { page: Page },
    use: (value: Page) => Promise<void>
  ) => {

    const inventoryPage = new InventoryPage(page);

    // ================================
    // ■ 商品一覧画面へ遷移
    // ================================
    // storageState は Cookie などだけを復元し、開いていた画面までは復元しないため、明示的に開く
    await inventoryPage.goto();

    // ================================
    // ■ ログイン済みの確認（商品一覧画面の表示確認）
    // ================================
    await inventoryPage.expectOnPage();

    // ログイン済みPageを返却
    await use(page);
  },
});

// expect再export
export { expect };

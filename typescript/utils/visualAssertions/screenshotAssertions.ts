import { Page, expect, test } from '@playwright/test';

// 画面の見た目を、基準画像と比べて確かめる。
// - 画面の表示の確認は、呼び出す側（前提を作る部品）で済ませておく
// - 撮る前に、フォントと、ページの中の画像の要素（背景として描く絵は含まない）の読み込みが終わるのを待つ。
//   画面によっては、見出しが出た後も画像の読み込みが続くため
// - 固定の時間の待ちは使わない（環境によって足りなかったり無駄だったりするため。python/decisions.md の論点21）
// - 比べる処理と、失敗したときの画像の保存は、Playwright の比べる機能に任せる。
//   この機能は、続けて撮った2枚が同じになるまで撮り直してから比べる

// 画像の読み込みを待つ上限。Playwright の確かめの待ち時間（設定の expect.timeout）の初期値（設定で指定していないため5秒）と同じにして、
// 読み込みが終わらないときに、テストの時間切れより先に、画像の読み込みの待ちとして失敗させる。
// 設定で確かめの待ち時間を変えるときは、この値も見直す
const IMAGE_LOAD_TIMEOUT_MS = 5_000;

// 基準画像のファイル名（例：login-page.png）と、違う画素の割合の上限（例：0.01 = 1%）を受け取る。
// 失敗したときに、この部品の中ではなく、テストの呼び出しの行で報告されるよう、1つの手順にまとめる
export async function expectScreenshotMatches(page: Page, snapshotName: string, maxDiffPixelRatio: number) {

  await test.step(`見た目を基準画像と比べる（${snapshotName}）`, async () => {

    // 大きさが違うときに、見た目の違いではなく、大きさの違いとして失敗が分かるよう、先に確かめる
    expect(page.viewportSize(), '画面の大きさが設定どおりであること').toEqual(test.info().project.use.viewport);

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    await page.waitForFunction(
      () => Array.from(document.images).every((image) => image.complete),
      undefined,
      { timeout: IMAGE_LOAD_TIMEOUT_MS },
    );

    await expect(page).toHaveScreenshot(snapshotName, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio,
    });
  }, { box: true });
}

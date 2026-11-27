import { Page, expect, test } from '@playwright/test';

// 画面の見た目を、基準画像と比べて確かめる。
// - 画面の表示の確認は、呼び出す前に Flow で済ませておく
// - 撮る前に、画面の大きさが設定どおりかを確かめ、フォントと画面内のすべての画像の読み込みが終わるのを待つ。
//   固定の時間の待ちは使わない（環境によって足りなかったり無駄だったりするため。python/decisions.md の論点21）

// 基準画像のファイル名（例：login-page.png）と、違う画素の割合の上限（例：0.01 = 1%）を受け取る
export async function expectScreenshotMatches(page: Page, snapshotName: string, maxDiffPixelRatio: number) {

  // 基準画像は設定の大きさで撮ったものなので、大きさが違うまま比べないよう、先に確かめる
  expect(page.viewportSize(), '画面の大きさが設定どおりであること').toEqual(test.info().project.use.viewport);

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));

  await expect(page).toHaveScreenshot(snapshotName, {
    animations: 'disabled',
    caret: 'hide',
    maxDiffPixelRatio,
  });
}

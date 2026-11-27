// Products画面の見た目の比較のテスト
import { test } from '../../fixtures/loginFixture';
import { expectScreenshotMatches } from '../../utils/visualAssertions/screenshotAssertions';

test.describe('Products画面の見た目', () => {

  // ログイン済みの画面は、Products画面を開いて表示を確かめた状態で始まる（カートは空）
  test('TC-VIS-002：Products画面の見た目が、基準画像と一致すること', async ({ loggedPage }) => {

    await expectScreenshotMatches(loggedPage, 'inventory-page.png', 0.02);
  });
});

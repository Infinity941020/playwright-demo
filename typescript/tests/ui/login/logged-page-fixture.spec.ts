// ログイン済みの画面を用意する部品が、正しく動くことを確かめるテスト（テストケースの件数には含めない）。
// ログイン済みの状態から始める各画面のテストは、この部品を使っている
import { test } from '../../../fixtures/loginFixture';
import { InventoryFlow } from '../../../flows/InventoryFlow';
import { expectOnInventoryPage } from '../../../utils/uiAssertions/inventoryAssertions';

test.describe('ログイン済みの画面を用意する部品', () => {

  test('テストケース外（部品の動作確認）：ログインの操作をしなくても、商品一覧画面が開いていること', async ({ loggedPage }) => {

    const inventoryFlow = new InventoryFlow(loggedPage);

    await expectOnInventoryPage(inventoryFlow);
  });
});

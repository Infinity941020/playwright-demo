// Playwrightテスト機能（fixture版）を使用
import { test } from '../../fixtures/loginFixture';

// CartFlow（業務フロー）
import { CartFlow } from '../../flows/CartFlow';

/*
================================
カートバッジ検証テスト（完全統一版）
================================
*/

test.describe('カートバッジ検証テスト', () => {

  /*
  ================================
  ① 1件追加
  ================================
  */
  test('① 1件追加時のバッジ表示確認', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await cartFlow.addItems('single');

    await cartFlow.expectBadgeCount(1);
  });

  /*
  ================================
  ② 全件追加
  ================================
  */
  test('② 全件追加時のバッジ件数確認', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    const count = await cartFlow.addItems('multi');

    await cartFlow.expectBadgeCount(count);
  });

  /*
  ================================
  ③ 1件削除
  ================================
  */
  test('③ 1件削除時のバッジ件数確認', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    const count = await cartFlow.addItems('multi');

    await cartFlow.openCart();

    await cartFlow.removeFirstItem();

    await cartFlow.expectBadgeCount(count - 1);
  });

  /*
  ================================
  ④ 2件削除
  ================================
  */
  test('④ 2件削除時のバッジ件数確認', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    const count = await cartFlow.addItems('multi');

    await cartFlow.openCart();

    await cartFlow.removeFirstItem();
    await cartFlow.removeFirstItem();

    await cartFlow.expectBadgeCount(count - 2);
  });

  /*
  ================================
  ⑤ 全削除
  ================================
  */
  test('⑤ 全件削除時はバッジが非表示になる', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await cartFlow.addItems('multi');

    await cartFlow.openCart();

    await cartFlow.clearCart();

    await cartFlow.expectBadgeCount(0);
  });

});
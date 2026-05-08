// Playwrightのテスト機能（fixture版）
import { test } from '../../fixtures/loginFixture';

// CartFlow（カート業務フロー）
import { CartFlow } from '../../flows/CartFlow';

/*
================================
カート機能 E2Eテスト（Flow完全統一版）
================================
*/

test.describe('カート機能テスト', () => {

  /*
  ================================
  パターン①：単一商品追加
  ================================
  */
  test('商品を1つカートに追加できること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await cartFlow.addItems('single');

    await cartFlow.openCart();

    await cartFlow.expectItemCount(1);
  });

  /*
  ================================
  パターン②：複数商品追加
  ================================
  */
  test('複数商品をカートに追加できること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    const count = await cartFlow.addItems('multi');

    await cartFlow.openCart();

    await cartFlow.expectItemCount(count);
  });

  /*
  ================================
  パターン③：削除確認
  ================================
  */
  test('カート内商品の削除ができること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await cartFlow.addItems('single');

    await cartFlow.openCart();

    await cartFlow.removeFirstItem();

    await cartFlow.expectItemCount(0);
  });

});
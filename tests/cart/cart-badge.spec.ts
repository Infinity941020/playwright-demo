/*
================================
Playwrightテスト機能（fixture版）
================================
*/
import { test } from '../../fixtures/loginFixture';

/*
================================
CartFlow（業務フロー）
================================
*/
import { CartFlow } from '../../flows/CartFlow';

/*
================================
cartHelper（Cart前準備共通化）
================================
*/
import { prepareCart } from '../../utils/cartHelper';

/*
================================
Cart Assertions
================================
*/
import {
  expectSingleCartItem,
  expectMultipleCartItems,
  expectEmptyCart,
  expectCartBadgeCount,
  expectCartBadgeHidden
} from '../../utils/cartAssertions';

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

    await test.step('商品を1件追加', async () => {
      await cartFlow.addItems('single');
    });

    await test.step('バッジ件数確認', async () => {
      await expectCartBadgeCount(cartFlow, 1);
    });

    /*
    ================================
    Cart画面へ遷移
    ================================
    */
    await test.step('カート画面へ遷移', async () => {
      await cartFlow.openCart();
    });

    await test.step('Cart状態確認', async () => {
      await expectSingleCartItem(cartFlow);
    });
  });

  /*
  ================================
  ② 全件追加
  ================================
  */
  test('② 全件追加時のバッジ件数確認', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    let count: number;

    await test.step('商品を全件追加', async () => {
      count = await cartFlow.addItems('multi');
    });

    await test.step('バッジ件数確認', async () => {
      await expectCartBadgeCount(cartFlow, count);
    });

    /*
    ================================
    Cart画面へ遷移
    ================================
    */
    await test.step('カート画面へ遷移', async () => {
      await cartFlow.openCart();
    });

    await test.step('Cart状態確認', async () => {
      await expectMultipleCartItems(cartFlow, count);
    });
  });

  /*
  ================================
  ③ 1件削除
  ================================
  */
  test('③ 1件削除時のバッジ件数確認', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    let count: number;

    await test.step('初期状態（複数商品追加）', async () => {
      count = await prepareCart(cartFlow, 'multi');
    });

    await test.step('1件削除', async () => {
      await cartFlow.removeFirstItem();
    });

    await test.step('バッジ件数確認', async () => {
      await expectCartBadgeCount(cartFlow, count - 1);
    });
  });

  /*
  ================================
  ④ 2件削除
  ================================
  */
  test('④ 2件削除時のバッジ件数確認', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    let count: number;

    await test.step('初期状態（複数商品追加）', async () => {
      count = await prepareCart(cartFlow, 'multi');
    });

    await test.step('2件削除', async () => {
      await cartFlow.removeFirstItem();
      await cartFlow.removeFirstItem();
    });

    await test.step('バッジ件数確認', async () => {
      await expectCartBadgeCount(cartFlow, count - 2);
    });
  });

  /*
  ================================
  ⑤ 全削除
  ================================
  */
  test('⑤ 全件削除時はバッジが非表示になる', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await test.step('初期状態（複数商品追加）', async () => {
      await prepareCart(cartFlow, 'multi');
    });

    await test.step('全削除', async () => {
      await cartFlow.clearCart();
    });

    await test.step('バッジ非表示確認', async () => {
      await expectCartBadgeHidden(cartFlow);
    });

    await test.step('Cart状態確認', async () => {
      await expectEmptyCart(cartFlow);
    });
  });

});
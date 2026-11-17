// Playwrightのテスト機能（fixture版）
import { test } from '../../../fixtures/loginFixture';

// CartFlow（業務フロー）
import { CartFlow } from '../../../flows/CartFlow';

// cartHelper（準備処理）
import { prepareCart } from '../../../utils/cartHelper';

// Cart Assertions（UIレイヤー）
import {
  expectSingleCartItem,
  expectMultipleCartItems,
  expectEmptyCart
} from '../../../utils/uiAssertions/cartAssertions';

/*
================================
カート機能 E2Eテスト（Flow統一版）
================================
*/

test.describe('カート機能テスト', () => {

  /*
  ================================
  単一商品
  ================================
  */
  test('商品を1つカートに追加できること', async ({ loggedPage }: any) => {

    const cartFlow = new CartFlow(loggedPage);

    await test.step('カート初期化（単一商品）', async () => {

      await prepareCart(cartFlow, 'single');
    });

    await test.step('カート件数確認', async () => {

      await expectSingleCartItem(cartFlow);
    });
  });

  /*
  ================================
  複数商品
  ================================
  */
  test('複数商品をカートに追加できること', async ({ loggedPage }: any) => {

    const cartFlow = new CartFlow(loggedPage);

    let count: number;

    await test.step('カート初期化（複数商品）', async () => {

      count = await prepareCart(cartFlow, 'multi');
    });

    await test.step('カート件数確認', async () => {

      await expectMultipleCartItems(
        cartFlow,
        count
      );
    });
  });

  /*
  ================================
  削除
  ================================
  */
  test('カート内商品の削除ができること', async ({ loggedPage }: any) => {

    const cartFlow = new CartFlow(loggedPage);

    await test.step('カート初期化（単一商品）', async () => {

      await prepareCart(cartFlow, 'single');
    });

    await test.step('商品削除', async () => {

      await cartFlow.removeFirstItem();
    });

    await test.step('空カート確認', async () => {

      await expectEmptyCart(cartFlow);
    });
  });

});
// Playwrightのテスト機能（fixture版）
import { test } from '../../fixtures/loginFixture';

// CartFlow（カート業務フロー）
import { CartFlow } from '../../flows/CartFlow';

// cartHelper（Cart前準備共通化）
import { prepareCart } from '../../utils/cartHelper';

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

    await test.step('カート初期化（単一商品追加）', async () => {
      await prepareCart(cartFlow, 'single');
    });

    await test.step('カート件数確認', async () => {
      await cartFlow.expectItemCount(1);
    });
  });

  /*
  ================================
  パターン②：複数商品追加
  ================================
  */
  test('複数商品をカートに追加できること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    let count: number;

    await test.step('カート初期化（複数商品追加）', async () => {
      count = await prepareCart(cartFlow, 'multi');
    });

    await test.step('カート件数確認', async () => {
      await cartFlow.expectItemCount(count);
    });
  });

  /*
  ================================
  パターン③：削除確認
  ================================
  */
  test('カート内商品の削除ができること', async ({ loggedPage }) => {

    const cartFlow = new CartFlow(loggedPage);

    await test.step('カート初期化（単一商品追加）', async () => {
      await prepareCart(cartFlow, 'single');
    });

    await test.step('商品削除', async () => {
      await cartFlow.removeFirstItem();
    });

    await test.step('カート件数確認', async () => {
      await cartFlow.expectItemCount(0);
    });
  });

});
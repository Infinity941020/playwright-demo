/*
================================
Cart APIテスト（MSW）
================================
*/

/*
================================
MSW Setup
================================
*/
import '../setup/msw.setup';

import { test } from '../../fixtures/apiFixture';

// テストデータ
import { apiCarts } from '../../data/apiCarts';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions
import {
  expectAddCartSuccess,
  expectGetCartListSuccess,
  expectDeleteCartSuccess,
  expectCartBadRequest
} from '../../utils/apiAssertions/cartAssertions';

/*
================================
Cart APIテスト
================================
*/
test.describe('Cart APIテスト', () => {

  /*
  =================================
  正常系：Cart追加成功
  =================================
  */
  test('Cart追加が成功すること', async ({ api }) => {

    const response = await api.cart.add(
      apiCarts.validCart
    );

    await logApiResponse(response);

    await expectAddCartSuccess(response);
  });

  /*
  =================================
  異常系：productId未指定
  =================================
  */
  test('productId未指定で失敗すること', async ({ api }) => {

    const response = await api.cart.add(
      apiCarts.inputPatterns.missingProductId
    );

    await logApiResponse(response);

    await expectCartBadRequest(response);
  });

  /*
  =================================
  正常系：quantity未指定時デフォルト補完
  =================================
  */
  test('quantity未指定でもデフォルト1で追加されること', async ({ api }) => {

    const response = await api.cart.add(
      apiCarts.inputPatterns.missingQuantity
    );

    await logApiResponse(response);

    await expectAddCartSuccess(response);
  });

  /*
  =================================
  異常系：空リクエスト
  =================================
  */
  test('空リクエストで失敗すること', async ({ api }) => {

    const response = await api.cart.add(
      apiCarts.inputPatterns.emptyRequest
    );

    await logApiResponse(response);

    await expectCartBadRequest(response);
  });

  /*
  =================================
  正常系：Cart一覧取得
  =================================
  */
  test('Cart一覧を取得できること', async ({ api }) => {

    const response = await api.cart.get();

    await logApiResponse(response);

    await expectGetCartListSuccess(response);
  });

  /*
  =================================
  正常系：Cart削除
  =================================
  */
  test('Cart削除が成功すること', async ({ api }) => {

    const createResponse = await api.cart.add(
      apiCarts.validCart
    );

    const createdBody = await createResponse.json();

    const response = await api.cart.delete(
      createdBody.id
    );

    await logApiResponse(response);

    await expectDeleteCartSuccess(response);
  });

  /*
  =================================
  MSW動作確認
  =================================
  */
  test('MSW動作確認（Cart追加）', async ({ api }) => {

    const response = await api.cart.add({
      productId: 1,
      quantity: 1,
    });

    await logApiResponse(response);

    const body = await response.json();

    console.log('MSW CHECK:', body);
  });

});
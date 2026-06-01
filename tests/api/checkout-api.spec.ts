/*
================================
Checkout APIテスト（MSW）
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
import { apiCheckout } from '../../data/apiCheckout';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions
import {
  expectCheckoutSuccess,
  expectCheckoutBadRequest,
} from '../../utils/apiAssertions/checkoutAssertions';

/*
================================
Checkout APIテスト
================================
*/
test.describe('Checkout APIテスト', () => {

  /*
  ================================
  ① Checkout成功
  ================================
  */
  test('Checkoutが成功すること', async ({ api }) => {

    const response = await api.checkout.create(
      apiCheckout.validCheckout
    );

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ② cartId未指定
  ================================
  */
  test('cartId未指定パターン', async ({ api }) => {

    const response = await api.checkout.create(
      apiCheckout.inputPatterns.missingCartId
    );

    await logApiResponse(response);

    await expectCheckoutBadRequest(response);
  });

  /*
  ================================
  ③ userId未指定
  ================================
  */
  test('userId未指定パターン', async ({ api }) => {

    const response = await api.checkout.create(
      apiCheckout.inputPatterns.missingUserId
    );

    await logApiResponse(response);

    await expectCheckoutBadRequest(response);
  });

  /*
  ================================
  ④ totalPrice未指定
  ================================
  */
  test('totalPrice未指定パターン', async ({ api }) => {

    const response = await api.checkout.create(
      apiCheckout.inputPatterns.missingTotalPrice
    );

    await logApiResponse(response);

    await expectCheckoutBadRequest(response);
  });

  /*
  ================================
  ⑤ 空リクエスト
  ================================
  */
  test('空リクエストパターン', async ({ api }) => {

    const response = await api.checkout.create(
      apiCheckout.inputPatterns.emptyRequest
    );

    await logApiResponse(response);

    await expectCheckoutBadRequest(response);
  });

});
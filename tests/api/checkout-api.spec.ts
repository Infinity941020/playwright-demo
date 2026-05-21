/*
================================
Checkout APIテスト
（JSONPlaceholder対応）
================================
*/

// Playwrightテストランナー
import { test } from '@playwright/test';

// API実行ヘルパー
import { executeCheckoutApi } from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions
import { expectCheckoutSuccess } from '../../utils/apiAssertions/checkoutAssertions';

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
  test('Checkoutが成功すること', async ({ request }) => {

    const response = await executeCheckoutApi(request, {
      cartId: 1,
      userId: 1,
      totalPrice: 5000
    });

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ② cartId未指定パターン
  ================================
  */
  test('cartId未指定パターン', async ({ request }) => {

    const response = await executeCheckoutApi(request, {
      userId: 1,
      totalPrice: 5000
    });

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ③ userId未指定パターン
  ================================
  */
  test('userId未指定パターン', async ({ request }) => {

    const response = await executeCheckoutApi(request, {
      cartId: 1,
      totalPrice: 5000
    });

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ④ totalPrice未指定パターン
  ================================
  */
  test('totalPrice未指定パターン', async ({ request }) => {

    const response = await executeCheckoutApi(request, {
      cartId: 1,
      userId: 1
    });

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ⑤ 空リクエストパターン
  ================================
  */
  test('空リクエストパターン', async ({ request }) => {

    const response = await executeCheckoutApi(request, {});

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

});
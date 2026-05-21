/*
================================
Checkout APIテスト
（JSONPlaceholder対応）
================================
*/

// Playwrightテストランナー
import { test } from '@playwright/test';

// テストデータ
import { apiCheckout } from '../../data/apiCheckout';

// API実行ヘルパー
import { executeCheckoutApi } from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions
import { expectCheckoutSuccess } from '../../utils/apiAssertions/checkoutAssertions';

/*
================================
JSONPlaceholder仕様上、
異常系HTTPエラーは返却されないため、
入力パターン検証として実施する
================================
*/

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

    const response = await executeCheckoutApi(
      request,
      apiCheckout.validCheckout
    );

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ② cartId未指定パターン
  ================================
  */
  test('cartId未指定パターン', async ({ request }) => {

    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.missingCartId
    );

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ③ userId未指定パターン
  ================================
  */
  test('userId未指定パターン', async ({ request }) => {

    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.missingUserId
    );

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ④ totalPrice未指定パターン
  ================================
  */
  test('totalPrice未指定パターン', async ({ request }) => {

    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.missingTotalPrice
    );

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ⑤ 空リクエストパターン
  ================================
  */
  test('空リクエストパターン', async ({ request }) => {

    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.emptyRequest
    );

    await logApiResponse(response);

    await expectCheckoutSuccess(response);
  });

});
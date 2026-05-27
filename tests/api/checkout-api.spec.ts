import '../setup/msw.setup';

/*
================================
Checkout APIテスト
（MSW仕様準拠版）
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
  test('Checkoutが成功すること', async ({ request }) => {

    /*
    ----------------------------
    Checkout API実行
    ----------------------------
    */
    const response = await executeCheckoutApi(
      request,
      apiCheckout.validCheckout
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    Checkout成功検証
    ----------------------------
    */
    await expectCheckoutSuccess(response);
  });

  /*
  ================================
  ② cartId未指定パターン
  ================================
  */
  test('cartId未指定パターン', async ({ request }) => {

    /*
    ----------------------------
    cartId未指定リクエスト
    ----------------------------
    */
    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.missingCartId
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    400エラー検証
    ----------------------------
    */
    await expectCheckoutBadRequest(response);
  });

  /*
  ================================
  ③ userId未指定パターン
  ================================
  */
  test('userId未指定パターン', async ({ request }) => {

    /*
    ----------------------------
    userId未指定リクエスト
    ----------------------------
    */
    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.missingUserId
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    400エラー検証
    ----------------------------
    */
    await expectCheckoutBadRequest(response);
  });

  /*
  ================================
  ④ totalPrice未指定パターン
  ================================
  */
  test('totalPrice未指定パターン', async ({ request }) => {

    /*
    ----------------------------
    totalPrice未指定リクエスト
    ----------------------------
    */
    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.missingTotalPrice
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    400エラー検証
    ----------------------------
    */
    await expectCheckoutBadRequest(response);
  });

  /*
  ================================
  ⑤ 空リクエストパターン
  ================================
  */
  test('空リクエストパターン', async ({ request }) => {

    /*
    ----------------------------
    空リクエスト送信
    ----------------------------
    */
    const response = await executeCheckoutApi(
      request,
      apiCheckout.inputPatterns.emptyRequest
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    400エラー検証
    ----------------------------
    */
    await expectCheckoutBadRequest(response);
  });

});
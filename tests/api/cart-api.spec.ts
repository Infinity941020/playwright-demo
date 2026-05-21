/*
================================
Cart APIテスト
（JSONPlaceholder対応）
================================
*/

// Playwrightテストランナー
import { test } from '@playwright/test';

// テストデータ
import { apiCarts } from '../../data/apiCarts';

// テスト実行ヘルパー
import {
  executeAddCartApi,
  executeGetCartApi,
  executeDeleteCartApi
} from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions
import {
  expectAddCartSuccess,
  expectGetCartListSuccess,
  expectDeleteCartSuccess,
  expectMissingTitlePattern,
  expectMissingUserIdPattern,
  expectEmptyCartRequestPattern
} from '../../utils/apiAssertions/cartAssertions';

/*
================================
JSONPlaceholder仕様上、
異常系HTTPエラーは返却されないため、
入力パターン検証として実施する
================================
*/

/*
================================
Cart APIテスト
================================
*/
test.describe('Cart APIテスト', () => {

  /*
  ================================
  ① Cart追加成功
  ================================
  */
  test('Cart追加が成功すること', async ({ request }) => {

    const response = await executeAddCartApi(
      request,
      apiCarts.validCart
    );

    await logApiResponse(response);

    await expectAddCartSuccess(response);
  });

  /*
  ================================
  ② title未入力
  ================================
  */
  test('title未入力パターン', async ({ request }) => {

    const response = await executeAddCartApi(
      request,
      apiCarts.inputPatterns.missingTitle
    );

    await logApiResponse(response);

    await expectMissingTitlePattern(response);
  });

  /*
  ================================
  ③ userId未入力
  ================================
  */
  test('userId未入力パターン', async ({ request }) => {

    const response = await executeAddCartApi(
      request,
      apiCarts.inputPatterns.missingUserId
    );

    await logApiResponse(response);

    await expectMissingUserIdPattern(response);
  });

  /*
  ================================
  ④ 空リクエスト
  ================================
  */
  test('空リクエストパターン', async ({ request }) => {

    const response = await executeAddCartApi(
      request,
      apiCarts.inputPatterns.emptyRequest
    );

    await logApiResponse(response);

    await expectEmptyCartRequestPattern(response);
  });

  /*
  ================================
  ⑤ Cart一覧取得
  ================================
  */
  test('Cart一覧を取得できること', async ({ request }) => {

    const response = await executeGetCartApi(request);

    await logApiResponse(response);

    await expectGetCartListSuccess(response);
  });

  /*
  ================================
  ⑥ Cart削除
  ================================
  */
  test('Cart削除が成功すること', async ({ request }) => {

    const response = await executeDeleteCartApi(
      request,
      1
    );

    await logApiResponse(response);

    await expectDeleteCartSuccess(response);
  });

});
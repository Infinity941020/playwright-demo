/*
================================
Cart APIテスト
（JSONPlaceholder対応）
================================
*/

// Playwrightテストランナー
import { test } from '@playwright/test';

// テスト実行ヘルパー
import {
  executeAddCartApi,
  executeGetCartApi,
  executeDeleteCartApi
} from '../../utils/apiHelper';

// API Logger
import { logApiResponse } from '../../utils/apiLogger';

// Assertions（Phase8 Final）
import {
  expectAddCartSuccess,
  expectGetCartListSuccess,
  expectDeleteCartSuccess
} from '../../utils/apiAssertions/cartAssertions';

/*
================================
Cart APIテスト
================================
*/
test.describe('Cart APIテスト', () => {

  /*
  ================================
  ① Cart追加
  ================================
  */
  test('Cart追加が成功すること', async ({ request }) => {

    const response = await executeAddCartApi(request, {
      title: 'Sample Cart Item',
      body: 'Cart Item Body',
      userId: 1
    });

    await logApiResponse(response);

    await expectAddCartSuccess(response);
  });

  /*
  ================================
  ② Cart一覧取得
  ================================
  */
  test('Cart一覧を取得できること', async ({ request }) => {

    const response = await executeGetCartApi(request);

    await logApiResponse(response);

    await expectGetCartListSuccess(response);
  });

  /*
  ================================
  ③ Cart削除
  ================================
  */
  test('Cart削除が成功すること', async ({ request }) => {

    const response = await executeDeleteCartApi(request, 1);

    await logApiResponse(response);

    await expectDeleteCartSuccess(response);
  });

});
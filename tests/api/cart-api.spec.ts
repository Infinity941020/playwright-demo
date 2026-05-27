import '../setup/msw.setup';

import { test } from '@playwright/test';

// テストデータ
import { apiCarts } from '../../data/apiCarts';

// API実行ヘルパー
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
  expectMissingProductIdPattern,
  expectEmptyCartRequestPattern
} from '../../utils/apiAssertions/cartAssertions';

/*
================================
Cart API Tests（MSW固定版）
================================
責務：
- Cart APIのMSW疎通確認
- Request/Response仕様確認
- Mock状態リセット確認
================================
*/

test.describe('Cart APIテスト', () => {

  /*
  ================================
  ① Cart追加成功
  ================================
  */
  test('Cart追加が成功すること', async ({ request }) => {

    /*
    ----------------------------
    正常なCart追加リクエスト実行
    ----------------------------
    */
    const response = await executeAddCartApi(
      request,
      apiCarts.validCart
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    レスポンス検証
    ----------------------------
    */
    await expectAddCartSuccess(response);
  });

  /*
  ================================
  ② productId未指定エラー
  ================================
  */
  test('productId未指定で失敗すること', async ({ request }) => {

    /*
    ----------------------------
    productId未指定リクエスト実行
    ----------------------------
    */
    const response = await executeAddCartApi(
      request,
      apiCarts.inputPatterns.missingProductId
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    バリデーションエラー検証
    ----------------------------
    */
    await expectMissingProductIdPattern(response);
  });

  /*
  ================================
  ③ quantity未指定（デフォルト補完）
  ================================
  */
  test('quantity未指定でもデフォルト1で追加されること', async ({ request }) => {

    /*
    ----------------------------
    quantity未指定リクエスト実行
    ----------------------------
    */
    const response = await executeAddCartApi(
      request,
      apiCarts.inputPatterns.missingQuantity
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    デフォルト値補完確認
    ----------------------------
    */
    await expectAddCartSuccess(response);
  });

  /*
  ================================
  ④ 空リクエストエラー
  ================================
  */
  test('空リクエストで失敗すること', async ({ request }) => {

    /*
    ----------------------------
    空リクエスト実行
    ----------------------------
    */
    const response = await executeAddCartApi(
      request,
      apiCarts.inputPatterns.emptyRequest
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    バリデーションエラー検証
    ----------------------------
    */
    await expectEmptyCartRequestPattern(response);
  });

  /*
  ================================
  ⑤ Cart一覧取得
  ================================
  */
  test('Cart一覧を取得できること', async ({ request }) => {

    /*
    ----------------------------
    Cart一覧取得API実行
    ----------------------------
    */
    const response = await executeGetCartApi(request);

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    一覧取得結果検証
    ----------------------------
    */
    await expectGetCartListSuccess(response);
  });

  /*
  ================================
  ⑥ Cart削除
  ================================
  */
  test('Cart削除が成功すること', async ({ request }) => {

    /*
    ----------------------------
    削除対象Cartを事前作成
    ----------------------------
    */
    const createResponse = await executeAddCartApi(
      request,
      apiCarts.validCart
    );

    /*
    ----------------------------
    作成したCart情報取得
    ----------------------------
    */
    const createdBody = await createResponse.json();

    /*
    ----------------------------
    作成したCart IDで削除実行
    ----------------------------
    */
    const response = await executeDeleteCartApi(
      request,
      createdBody.id
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    削除成功検証
    ----------------------------
    */
    await expectDeleteCartSuccess(response);
  });

  /*
  ================================
  ⑦ MSW動作確認（追加）
  ================================
  */
  test('MSW動作確認（Cart追加）', async ({ request }) => {

    /*
    ----------------------------
    API Helper経由で実行
    ----------------------------
    */
    const response = await executeAddCartApi(
      request,
      {
        productId: 1,
        quantity: 1,
      }
    );

    /*
    ----------------------------
    APIレスポンスログ出力
    ----------------------------
    */
    await logApiResponse(response);

    /*
    ----------------------------
    レスポンスBody取得
    ----------------------------
    */
    const body = await response.json();

    /*
    ----------------------------
    MSW疎通ログ
    ----------------------------
    */
    console.log('MSW CHECK:', body);
  });

});
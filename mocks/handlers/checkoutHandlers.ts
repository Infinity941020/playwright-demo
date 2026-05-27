import { http, HttpResponse } from 'msw';

/*
================================
Checkout Mock DB
================================
Checkout状態をMSW内で管理
================================
*/
let checkoutCount = 0;

/*
================================
Checkoutリセット
================================
各テスト前に状態初期化
================================
*/
export const resetCheckoutMock = () => {
  checkoutCount = 0;
};

/*
================================
Checkout Request型
================================
MSW Request Body定義
================================
*/
type CheckoutRequestBody = {
  cartId?: number;
  userId?: number;
  totalPrice?: number;
};

/*
================================
Checkout API URL
================================
MSW intercept対象URL
================================
*/
const CHECKOUT_API_URL =
  'http://localhost/api/checkout';

/*
================================
Checkout Handlers
================================
MSW Checkout API定義
================================
*/
export const checkoutHandlers = [

  /*
  ================================
  Checkout実行API
  ================================
  */
  http.post(
    CHECKOUT_API_URL,
    async ({ request }) => {

      /*
      ================================
      Request Body取得
      ================================
      */
      const body =
        (await request.json()) as CheckoutRequestBody | null;

      /*
      ================================
      Checkout実行回数加算
      ================================
      */
      checkoutCount++;

      /*
      ================================
      疑似認証エラー再現
      ================================
      大量実行時の異常系テスト用
      ================================
      */
      if (checkoutCount >= 1000) {

        return HttpResponse.json(
          {
            error: 'unauthorized',
            message: 'mock auth error',
          },
          {
            status: 401,
          }
        );
      }

      /*
      ================================
      空Requestチェック
      ================================
      */
      if (!body) {

        return HttpResponse.json(
          {
            error: 'invalid payload',
          },
          {
            status: 400,
          }
        );
      }

      /*
      ================================
      必須項目チェック
      ================================
      */
      if (
        !body.cartId ||
        !body.userId ||
        !body.totalPrice
      ) {

        return HttpResponse.json(
          {
            error: 'invalid payload',
          },
          {
            status: 400,
          }
        );
      }

      /*
      ================================
      Checkout成功レスポンス
      ================================
      */
      return HttpResponse.json(
        {
          success: true,
          checkoutId: Date.now(),
          cartId: body.cartId,
          userId: body.userId,
          totalPrice: body.totalPrice,
        },
        {
          status: 201,
        }
      );
    }
  ),
];
import { APIRequestContext } from '@playwright/test';
import { REQRES_BASE_URL } from './apiConfig';

/*
================================
Login API（ReqRes）
================================
*/

/*
================================
Login API実行
================================
ReqRes実APIへリクエスト送信
================================
*/
export async function executeLoginApi(
  request: APIRequestContext,
  payload: Record<string, any>
) {
  return request.post(`${REQRES_BASE_URL}/api/login`, {
    data: payload,
  });
}

/*
================================
User API（ReqRes）
================================
*/

/*
================================
User取得API実行
================================
ReqRes実APIへリクエスト送信
================================
*/
export async function executeGetUserApi(
  request: APIRequestContext,
  userId: number
) {
  return request.get(`${REQRES_BASE_URL}/api/users/${userId}`);
}

/*
================================
Cart API（MSW）
================================
MSW intercept対象URL
================================
*/
const CART_BASE_URL = 'http://localhost/api/cart';

/*
================================
Cart追加API実行
================================
MSWでPOST /api/cartをMock化
================================
*/
export async function executeAddCartApi(
  request: APIRequestContext,
  payload: Record<string, any>
) {
  return request.post(CART_BASE_URL, {
    data: payload,
  });
}

/*
================================
Cart取得API実行
================================
MSWでGET /api/cartをMock化
================================
*/
export async function executeGetCartApi(
  request: APIRequestContext
) {
  return request.get(CART_BASE_URL);
}

/*
================================
Cart削除API実行
================================
MSWでDELETE /api/cart/:idをMock化
================================
*/
export async function executeDeleteCartApi(
  request: APIRequestContext,
  cartId: number
) {
  return request.delete(`${CART_BASE_URL}/${cartId}`);
}

/*
================================
Checkout API（MSW）
================================
MSW intercept対象URL
================================
*/
const CHECKOUT_BASE_URL = 'http://localhost/api/checkout';

/*
================================
Checkout API実行
================================
MSWでPOST /api/checkoutをMock化
================================
*/
export async function executeCheckoutApi(
  request: APIRequestContext,
  payload: Record<string, any>
) {
  return request.post(CHECKOUT_BASE_URL, {
    data: payload,
  });
}

/*
================================
Logout API（MSW）
================================
MSW intercept対象URL
================================
*/
const LOGOUT_BASE_URL = 'http://localhost/api/logout';

/*
================================
Logout API実行
================================
ステートレス認証解除API
================================
*/
export async function executeLogoutApi(
  request: APIRequestContext,
  payload: Record<string, any> = {},
  token?: string
) {
  return request.post(LOGOUT_BASE_URL, {
    data: payload,
    headers: {
      ...(token ? { Authorization: token } : {}),
    },
  });
}
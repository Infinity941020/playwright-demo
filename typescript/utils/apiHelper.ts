import { APIRequestContext, APIResponse } from '@playwright/test';

// パスだけを持つ。接続先（ホストとポート）は、テストごとに立てるモックのサーバーに合わせて、通信の部品が決める（fixtures/apiFixture.ts）
const BASE_PATH = '/api';

/*
================================
Login API
================================
*/
export function executeLoginApi(
  request: APIRequestContext,
  payload: Record<string, unknown>
): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/login`, {
    data: payload,
  });
}

/*
================================
User API（参照専用）
================================
*/
export function executeGetUserApi(
  request: APIRequestContext,
  userId: number
): Promise<APIResponse> {
  return request.get(`${BASE_PATH}/users/${userId}`);
}

/*
================================
Cart API
================================
*/
export function executeAddCartApi(
  request: APIRequestContext,
  payload: Record<string, unknown>
): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/cart`, {
    data: payload,
  });
}

export function executeGetCartApi(
  request: APIRequestContext
): Promise<APIResponse> {
  return request.get(`${BASE_PATH}/cart`);
}

export function executeDeleteCartApi(
  request: APIRequestContext,
  cartId: number
): Promise<APIResponse> {
  return request.delete(`${BASE_PATH}/cart/${cartId}`);
}

/*
================================
Checkout API
================================
*/
export function executeCheckoutApi(
  request: APIRequestContext,
  payload: Record<string, unknown>
): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/checkout`, {
    data: payload,
  });
}

/*
================================
Logout API（最終固定版）
================================
*/

export type LogoutPayload = {
  body?: Record<string, unknown>;
  token?: string;
};

export function executeLogoutApi(
  request: APIRequestContext,
  payload: LogoutPayload = {}
): Promise<APIResponse> {
  return request.post(`${BASE_PATH}/logout`, {
    data: payload.body ?? {},
    headers: payload.token
      ? { Authorization: payload.token }
      : undefined,
  });
}
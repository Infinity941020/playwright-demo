import { APIRequestContext, APIResponse } from '@playwright/test';

/*
================================
Base URL（MSW統一）
================================
*/
const BASE_URL = 'http://localhost/api';

/*
================================
Login API
================================
*/
export function executeLoginApi(
  request: APIRequestContext,
  payload: Record<string, unknown>
): Promise<APIResponse> {
  return request.post(`${BASE_URL}/login`, {
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
  return request.get(`${BASE_URL}/users/${userId}`);
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
  return request.post(`${BASE_URL}/cart`, {
    data: payload,
  });
}

export function executeGetCartApi(
  request: APIRequestContext
): Promise<APIResponse> {
  return request.get(`${BASE_URL}/cart`);
}

export function executeDeleteCartApi(
  request: APIRequestContext,
  cartId: number
): Promise<APIResponse> {
  return request.delete(`${BASE_URL}/cart/${cartId}`);
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
  return request.post(`${BASE_URL}/checkout`, {
    data: payload,
  });
}

/*
================================
Logout API（最終固定版）
================================
*/

export type LogoutPayload = {
  body?: {
    reason?: string;
  };
  token?: string;
};

export function executeLogoutApi(
  request: APIRequestContext,
  payload: LogoutPayload = {}
): Promise<APIResponse> {
  return request.post(`${BASE_URL}/logout`, {
    data: payload.body ?? {},
    headers: payload.token
      ? { Authorization: payload.token }
      : undefined,
  });
}
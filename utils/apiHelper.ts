import { APIRequestContext } from '@playwright/test';

/*
================================
Base URL（MSW統一）
================================
すべて localhost に統一
================================
*/
const BASE_URL = 'http://localhost/api';

/*
================================
Login API
================================
*/
export async function executeLoginApi(
  request: APIRequestContext,
  payload: Record<string, any>
) {
  return request.post(`${BASE_URL}/login`, {
    data: payload,
  });
}

/*
================================
User API
================================
*/
export async function executeGetUserApi(
  request: APIRequestContext,
  userId: number
) {
  return request.get(`${BASE_URL}/users/${userId}`);
}

/*
================================
Cart API
================================
*/
const CART_URL = `${BASE_URL}/cart`;

export async function executeAddCartApi(
  request: APIRequestContext,
  payload: Record<string, any>
) {
  return request.post(CART_URL, {
    data: payload,
  });
}

export async function executeGetCartApi(
  request: APIRequestContext
) {
  return request.get(CART_URL);
}

export async function executeDeleteCartApi(
  request: APIRequestContext,
  cartId: number
) {
  return request.delete(`${CART_URL}/${cartId}`);
}

/*
================================
Checkout API
================================
*/
const CHECKOUT_URL = `${BASE_URL}/checkout`;

export async function executeCheckoutApi(
  request: APIRequestContext,
  payload: Record<string, any>
) {
  return request.post(CHECKOUT_URL, {
    data: payload,
  });
}

/*
================================
Logout API
================================
*/
const LOGOUT_URL = `${BASE_URL}/logout`;

export async function executeLogoutApi(
  request: APIRequestContext,
  payload: Record<string, any> = {},
  token?: string
) {
  return request.post(LOGOUT_URL, {
    data: payload,
    headers: {
      ...(token ? { Authorization: token } : {}),
    },
  });
}
import { APIRequestContext } from '@playwright/test';

import {
  JSONPLACEHOLDER_BASE_URL,
  REQRES_BASE_URL
} from './apiConfig';

/*
================================
Login API（ReqRes移行対象）
================================
*/
export async function executeLoginApi(
  request: APIRequestContext,
  payload: object
) {
  return request.post(`${REQRES_BASE_URL}/api/login`, {
    data: payload
  });
}

/*
================================
User API（ReqRes移行対象）
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
Cart API（JSONPlaceholder維持）
================================
*/
export async function executeAddCartApi(
  request: APIRequestContext,
  payload: object
) {
  return request.post(`${JSONPLACEHOLDER_BASE_URL}/posts`, {
    data: payload
  });
}

export async function executeGetCartApi(
  request: APIRequestContext
) {
  return request.get(`${JSONPLACEHOLDER_BASE_URL}/posts`);
}

export async function executeDeleteCartApi(
  request: APIRequestContext,
  cartId: number
) {
  return request.delete(`${JSONPLACEHOLDER_BASE_URL}/posts/${cartId}`);
}

/*
================================
Checkout API（JSONPlaceholder維持）
================================
*/
export async function executeCheckoutApi(
  request: APIRequestContext,
  payload: {
    cartId?: number;
    userId?: number;
    totalPrice?: number;
  }
) {
  return request.post(`${JSONPLACEHOLDER_BASE_URL}/posts`, {
    data: payload
  });
}
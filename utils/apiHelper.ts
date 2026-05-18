import { APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/*
================================
Pseudo Login API（JSONPlaceholder仕様）
※ 実際は posts 作成API
================================
*/
export async function executeLoginApi(
  request: APIRequestContext,
  payload: object
) {
  return await request.post(`${BASE_URL}/posts`, {
    data: payload
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
  return await request.get(`${BASE_URL}/users/${userId}`);
}
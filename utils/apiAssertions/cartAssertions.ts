/*
================================
Cart API Assertions
（JSONPlaceholder対応）
================================
*/

import { expect, APIResponse } from '@playwright/test';

/*
================================
Cart一覧取得成功
================================
*/
export async function expectGetCartListSuccess(
  response: APIResponse
): Promise<void> {

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();

  expect(body.length).toBeGreaterThan(0);
}

/*
================================
Cart作成成功
================================
*/
export async function expectAddCartSuccess(
  response: APIResponse
): Promise<void> {

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.id).toBeDefined();

  expect(body.title).toBeDefined();
}

/*
================================
Cart削除成功
================================
*/
export async function expectDeleteCartSuccess(
  response: APIResponse
): Promise<void> {

  expect(response.status()).toBe(200);

  const body = await response.json();

  /*
  JSONPlaceholder DELETEは {}
  を返す
  */

  expect(body).toEqual({});
}
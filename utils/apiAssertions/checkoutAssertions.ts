/*
================================
Checkout API Assertions
================================
*/

import { expect, APIResponse } from '@playwright/test';

/*
================================
Checkout成功検証（軽量版）
================================
*/
export async function expectCheckoutSuccess(
  response: APIResponse
): Promise<void> {

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body).toBeDefined();

  expect(body.id).toBeDefined();

  /*
  =================================
  JSONPlaceholder仕様：
  ・入力欠損でもレスポンスは成功扱い
  ・値は保証されない
  =================================
  */
}
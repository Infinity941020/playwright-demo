/*
================================
Checkout API Assertions（MSW統一版）
================================
*/

import { APIResponse, expect } from '@playwright/test';

// 共通
// HTTPステータス検証共通ロジック
import { expectStatus } from './commonAssertions';

/*
================================
HTTP Status
================================
*/
const STATUS = {
  OK: 201,
  BAD_REQUEST: 400,
} as const;

/*
================================
① Checkout成功
================================
*/
export async function expectCheckoutSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body).toBeDefined();

  /*
  ================================
  成功レスポンス必須項目
  ================================
  */
  expect(body.checkoutId).toBeDefined();
  expect(body.cartId).toBeDefined();
  expect(body.userId).toBeDefined();
  expect(body.totalPrice).toBeDefined();

  /*
  ================================
  型保証（最低限）
  ================================
  */
  expect(typeof body.checkoutId).toBe('number');
  expect(typeof body.cartId).toBe('number');
  expect(typeof body.userId).toBe('number');
  expect(typeof body.totalPrice).toBe('number');
}

/*
================================
② Checkout失敗（不正リクエスト）
================================
*/
export async function expectCheckoutBadRequest(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.error).toBeDefined();

  /*
  ================================
  エラー形式統一（MSW仕様）
  ================================
  */
  expect(typeof body.error).toBe('string');
}
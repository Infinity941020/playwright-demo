/*
================================
Checkout API Assertions
（MSW仕様準拠版）
================================
*/

import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

/*
================================
期待ステータス定義
================================
*/
const STATUS = {
  SUCCESS: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
} as const;

/*
================================
① Checkout成功
================================
*/
export async function expectCheckoutSuccess(
  response: APIResponse
): Promise<void> {
  expectStatus(response, STATUS.SUCCESS);

  const body = await response.json();

  expect(body).toBeDefined();

  // MSW仕様：成功時は必ずcheckoutIdが返る
  expect(body.checkoutId).toBeDefined();

  // 必須項目チェック（仕様整合性確認）
  expect(body.cartId).toBeDefined();
  expect(body.userId).toBeDefined();
  expect(body.totalPrice).toBeDefined();
}

/*
================================
② Checkout失敗（400系）
================================
*/
export async function expectCheckoutBadRequest(
  response: APIResponse
): Promise<void> {
  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.error).toBeDefined();
}

/*
================================
③ Checkout未認証（将来用）
================================
*/
export async function expectCheckoutUnauthorized(
  response: APIResponse
): Promise<void> {
  expectStatus(response, STATUS.UNAUTHORIZED);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.error).toBeDefined();
}

/*
================================
④ 汎用（必要なら）
================================
*/
export async function expectCheckoutResponse(
  response: APIResponse,
  expectedStatus: number
): Promise<void> {
  expectStatus(response, expectedStatus);

  const body = await response.json();
  expect(body).toBeDefined();
}
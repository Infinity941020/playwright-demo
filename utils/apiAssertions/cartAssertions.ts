/*
================================
Cart API Assertions（MSW安定版）
================================
*/

import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

/*
================================
HTTP Status
================================
*/
const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
} as const;

/*
================================
① Cart一覧取得成功
================================
*/
export async function expectGetCartListSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(Array.isArray(body.items)).toBe(true);
}

/*
================================
② Cart追加成功
================================
*/
export async function expectAddCartSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.CREATED);

  const body = await response.json();

  expect(body).toBeDefined();

  expect(body.id).toBeDefined();
  expect(body.productId).toBeDefined();

  expect(typeof body.productId).toBe('number');

  // MSW仕様：quantityは必ず1以上
  expect(body.quantity).toBeGreaterThan(0);
}

/*
================================
③ productId未指定エラー
================================
*/
export async function expectMissingProductIdPattern(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body).toMatchObject({
    error: 'invalid payload',
  });
}

/*
================================
④ 空リクエストエラー
================================
*/
export async function expectEmptyCartRequestPattern(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body).toMatchObject({
    error: 'invalid payload',
  });
}

/*
================================
⑤ Cart削除成功
================================
*/
export async function expectDeleteCartSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body).toBeDefined();

  // MSW仕様：削除は成功フラグのみ保証
  expect(body.success).toBe(true);
}
/*
================================
Logout API Assertions（MSW統一版）
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
  OK: 200,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
} as const;

/*
================================
① Logout成功
================================
*/
export async function expectLogoutSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body).toBeDefined();

  /*
  ================================
  成功レスポンス仕様
  ================================
  */
  expect(body.success).toBe(true);
  expect(typeof body.success).toBe('boolean');
}

/*
================================
② Logout未認証（401）
================================
*/
export async function expectLogoutUnauthorized(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.UNAUTHORIZED);

  const body = await response.json();

  expect(body).toBeDefined();

  /*
  ================================
  エラー仕様（認証失敗）
  ================================
  */
  expect(body.error).toBeDefined();
  expect(typeof body.error).toBe('string');
}

/*
================================
③ Logout不正リクエスト（400）
================================
*/
export async function expectLogoutBadRequest(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body).toBeDefined();

  /*
  ================================
  エラー仕様（リクエスト不正）
  ================================
  */
  expect(body.error).toBeDefined();
  expect(typeof body.error).toBe('string');
}
/*
================================
Login API Assertions（ReqRes / MSW統一版）
================================
*/

import { APIResponse, expect } from '@playwright/test';

// 共通
// HTTPステータス検証共通ロジック
import { expectStatus } from './commonAssertions';

// schema
// Loginレスポンス構造検証（成功時のみ）
import { loginSchema } from '../schema/loginSchema';

/*
================================
HTTP Status
================================
*/
const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
} as const;

/*
================================
① Login成功
================================
*/
export async function expectLoginSuccess(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body).toBeDefined();

  // schema（token構造保証）
  loginSchema.parse(body);

  expect(body.token).toBeDefined();
  expect(typeof body.token).toBe('string');
}

/*
================================
② Login失敗（不正リクエスト）
================================
*/
export async function expectLoginBadRequest(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.error).toBeDefined();

  // errorは構造のみ保証（内容固定しない）
  expect(typeof body.error).toBe('string');
}

/*
================================
③ Login失敗（未認証）
================================
*/
export async function expectLoginUnauthorized(
  response: APIResponse
): Promise<void> {

  expectStatus(response, STATUS.UNAUTHORIZED);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.error).toBeDefined();

  expect(typeof body.error).toBe('string');
}
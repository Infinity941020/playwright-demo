import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

/*
================================
期待ステータス
================================
*/
const STATUS = {
  SUCCESS: 200,
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
  expectStatus(response, STATUS.SUCCESS);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.success).toBe(true);
}

/*
================================
② 未認証（401）
================================
*/
export async function expectLogoutUnauthorized(
  response: APIResponse
): Promise<void> {
  expectStatus(response, STATUS.UNAUTHORIZED);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.error).toBe('unauthorized');
}

/*
================================
③ 不正リクエスト（400）
================================
*/
export async function expectLogoutBadRequest(
  response: APIResponse
): Promise<void> {
  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body).toBeDefined();
  expect(body.error).toBe('invalid request');
}
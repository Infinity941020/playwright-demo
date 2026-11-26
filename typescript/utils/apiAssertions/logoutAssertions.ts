import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

// Logout の API の返事を確かめる

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
} as const;

// ログアウトできたこと（200、success が true）
export async function expectLogoutSuccess(response: APIResponse) {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body.success).toBe(true);
}

// 認証されていないとして断られたこと（401、エラーの文言が期待値と同じ）
export async function expectLogoutUnauthorized(response: APIResponse, error: string) {

  expectStatus(response, STATUS.UNAUTHORIZED);

  const body = await response.json();

  expect(body.error).toBe(error);
}

// 正しくないリクエストとして断られたこと（400、エラーの文言が期待値と同じ）
export async function expectLogoutBadRequest(response: APIResponse, error: string) {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body.error).toBe(error);
}

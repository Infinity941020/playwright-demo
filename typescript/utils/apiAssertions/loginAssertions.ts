import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

// Login の API の返事を確かめる

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
} as const;

// ログインできたこと（200、トークンが期待値と同じ）
export async function expectLoginSuccess(response: APIResponse, token: string) {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body.token).toBe(token);
}

// ログインできなかったこと（400、エラーの文言が期待値と同じ）
export async function expectLoginBadRequest(response: APIResponse, error: string) {

  expectStatus(response, STATUS.BAD_REQUEST);

  const body = await response.json();

  expect(body.error).toBe(error);
}

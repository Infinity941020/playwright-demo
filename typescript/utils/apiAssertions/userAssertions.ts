import { APIResponse, expect } from '@playwright/test';
import { expectStatus } from './commonAssertions';

// User の API の返事を確かめる

const STATUS = {
  OK: 200,
  NOT_FOUND: 404,
} as const;

// ユーザーの情報を取得できたこと（200、5つの項目と値が期待値と同じ）
export async function expectSingleUserResponse(response: APIResponse, user: Record<string, unknown>) {

  expectStatus(response, STATUS.OK);

  const body = await response.json();

  expect(body.data).toEqual(user);
}

// 存在しないユーザーとして、404 と空のオブジェクトが返ったこと
export async function expectUserNotFound(response: APIResponse) {

  expectStatus(response, STATUS.NOT_FOUND);

  const body = await response.json();

  expect(body).toEqual({});
}

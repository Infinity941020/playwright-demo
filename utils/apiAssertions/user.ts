import { expect, APIResponse } from '@playwright/test';
import { expectStatus } from './common';

/*
================================
User API Assertion
================================
*/

// 単一ユーザー取得
export async function expectSingleUserResponse(
  response: APIResponse
) {
  expectStatus(response, 200);

  const body = await response.json();

  expect(body.data).toBeTruthy();
  expect(body.data.id).toBeTruthy();
  expect(body.data.email).toContain('@');
  expect(body.data.first_name).toBeTruthy();
  expect(body.data.last_name).toBeTruthy();
}
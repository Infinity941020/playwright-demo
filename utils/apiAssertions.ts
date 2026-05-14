/*
================================
API Assertions
================================
*/

import { expect, APIResponse } from '@playwright/test';

/*
================================
Login Success Assertion
================================
*/

// 正常ログイン検証
export async function expectLoginSuccess(
  response: APIResponse
) {

  // status code検証
  expect(response.status()).toBe(200);

  // response body取得
  const body = await response.json();

  // token存在確認
  expect(body.token).toBeTruthy();
}

/*
================================
Login Failure Assertion
================================
*/

// password未入力検証
export async function expectMissingPasswordError(
  response: APIResponse
) {

  // status code検証
  expect(response.status()).toBe(400);

  // response body取得
  const body = await response.json();

  // error message検証
  expect(body.error).toContain('Missing password');
}
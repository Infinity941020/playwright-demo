/*
================================
API Assertions
================================
*/

import { expect, APIResponse } from '@playwright/test';

/*
================================
Common Assertions
================================
*/

// status code検証
export function expectStatus(
  response: APIResponse,
  expectedStatus: number
) {
  expect(response.status()).toBe(expectedStatus);
}

// error message検証
export async function expectErrorMessage(
  response: APIResponse,
  expectedMessage: string
) {

  // response body取得
  const body = await response.json();

  // error message検証
  expect(body.error).toContain(expectedMessage);
}

// token存在確認
export async function expectTokenExists(
  response: APIResponse
) {

  // response body取得
  const body = await response.json();

  // token存在確認
  expect(body.token).toBeTruthy();
}

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
  expectStatus(response, 200);

  // token存在確認
  await expectTokenExists(response);
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
  expectStatus(response, 400);

  // error message検証
  await expectErrorMessage(
    response,
    'Missing password'
  );
}

/*
================================
GET User Success Assertion
================================
*/

// 単一ユーザー取得検証
export async function expectSingleUserResponse(
  response: APIResponse
) {

  // status code検証
  expect(response.status()).toBe(200);

  // response body取得
  const body = await response.json();

  // data存在確認
  expect(body.data).toBeTruthy();

  // user id確認
  expect(body.data.id).toBeTruthy();

  // email確認
  expect(body.data.email).toContain('@');

  // first_name確認
  expect(body.data.first_name).toBeTruthy();

  // last_name確認
  expect(body.data.last_name).toBeTruthy();
}
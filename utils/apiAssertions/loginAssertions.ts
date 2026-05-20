// Playwright APIレスポンス型
import { APIResponse, expect } from '@playwright/test';

// 共通Assertion
import {
  expectStatus,
  expectCreatedResource
} from './commonAssertions';

// schema
import { loginSchema } from '../schema/loginSchema';

/*
================================
Login API Assertions
================================
JSONPlaceholder API仕様に基づいた
ログイン専用検証
================================
*/

const LOGIN_SUCCESS_STATUS = 201;

/*
================================
正常系：ログイン成功
================================
*/
export async function expectLoginSuccess(
  response: APIResponse
) {

  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();

  // schema構造保証
  loginSchema.parse(body);
}

/*
================================
password未入力パターン
================================
*/
export async function expectMissingPasswordPattern(
  response: APIResponse
) {

  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();

  expect(body.email).toBe('test@example.com');

  expect(body.password).toBeUndefined();

  expectCreatedResource(body);
}

/*
================================
email未入力パターン
================================
*/
export async function expectMissingEmailPattern(
  response: APIResponse
) {

  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();

  expect(body.password).toBe('password123');

  expect(body.email).toBeUndefined();

  expectCreatedResource(body);
}

/*
================================
空リクエストパターン
================================
*/
export async function expectEmptyRequestPattern(
  response: APIResponse
) {

  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();

  expectCreatedResource(body);

  expect(Object.keys(body)).toContain('id');
}

/*
================================
不正パスワード入力パターン
================================
*/
export async function expectWrongPasswordPattern(
  response: APIResponse
) {

  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();

  expect(body.email).toBe('test@example.com');

  expect(body.password).toBe('wrong-password');

  expectCreatedResource(body);
}
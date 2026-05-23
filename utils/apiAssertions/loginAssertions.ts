/*
================================
Login API Assertions（ReqRes版）
================================
・ReqRes API /api/login 前提
・成功 / 失敗の2パターンのみ
・入力バリエーション検証は廃止
================================
*/

import { APIResponse, expect } from '@playwright/test';

// 共通
import { expectStatus } from './commonAssertions';

// schema
import { loginSchema } from '../schema/loginSchema';

const LOGIN_SUCCESS_STATUS = 200;
const LOGIN_FAILURE_STATUS = 400;

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

  // schema（token構造）
  loginSchema.parse(body);

  expect(body.token).toBeDefined();
  expect(typeof body.token).toBe('string');
}

/*
================================
異常系：ログイン失敗
================================
*/
export async function expectLoginFailure(
  response: APIResponse
) {
  expectStatus(response, LOGIN_FAILURE_STATUS);

  const body = await response.json();

  expect(body.error).toBeDefined();
  expect(typeof body.error).toBe('string');
}
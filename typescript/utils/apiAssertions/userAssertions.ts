// Playwright APIレスポンス型
import { APIResponse, expect } from '@playwright/test';

// 共通ステータス検証
import { expectStatus } from './commonAssertions';

// schema
import { userSchema } from '../schema/userSchema';

/*
================================
User API Assertions
================================
JSONPlaceholder /users/{id} 検証（Aルート）
・正常系のみschema検証
・存在しないユーザーは入力パターン扱い
================================
*/

const USER_SUCCESS_STATUS = 200;
const USER_NOT_FOUND_STATUS = 404;

/*
================================
正常系：単一ユーザー取得
================================
*/
export async function expectSingleUserResponse(
  response: APIResponse
) {

  expectStatus(response, USER_SUCCESS_STATUS);

  const body = await response.json();

  // schemaによる構造保証
  userSchema.parse(body);
}

/*
================================
入力パターン：存在しないユーザー
================================
*/
export async function expectUserNotFoundPattern(
  response: APIResponse
) {

  expectStatus(response, USER_NOT_FOUND_STATUS);

  const body = await response.json();

  // JSONPlaceholderは {}
  expect(body).toEqual({});
}
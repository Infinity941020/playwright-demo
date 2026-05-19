// Playwright APIレスポンス型（APIレスポンスの型定義とexpectを使用）
import { APIResponse, expect } from '@playwright/test';

// 共通ステータス検証ロジック（HTTPステータス検証の共通化）
import { expectStatus } from './commonAssertions';

// ★ schema追加（Phase7）
import { loginSchema } from '../schema/loginSchema';

/*
================================
Login API Assertions
================================
JSONPlaceholder API仕様に基づいたログイン専用検証（Aルート）
・実際は /posts 作成APIのためtokenは存在しない
・入力パターン検証として利用
・レスポンス構造は schema ベースで検証する
================================
*/

const LOGIN_SUCCESS_STATUS = 201;

/*
================================
正常系：ログイン成功
================================
レスポンス:
・status 201
・schema検証（id構造保証）
*/
export async function expectLoginSuccess(response: APIResponse) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();

  // ★ Phase7：構造保証（schema）
  loginSchema.parse(body);
}

/*
================================
入力パターン：password未入力
================================
*/
export async function expectMissingPasswordPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();
  expect(body).toBeDefined();
}

/*
================================
入力パターン：email未入力
================================
*/
export async function expectMissingEmailPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();
  expect(body).toBeDefined();
}

/*
================================
入力パターン：空リクエスト
================================
*/
export async function expectEmptyRequestPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();
  expect(body).toBeDefined();
}

/*
================================
入力パターン：不正パスワード
================================
*/
export async function expectWrongPasswordPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);

  const body = await response.json();

  // 成功系と同じ構造（JSONPlaceholder仕様）
  loginSchema.parse(body);
}
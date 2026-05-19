// Playwright APIレスポンス型（APIレスポンスの型定義とexpectを使用）
import { APIResponse, expect } from '@playwright/test';

// 共通ステータス検証ロジック（HTTPステータス検証の共通化）
import { expectStatus } from './commonAssertions';

/*
================================
Login API Assertions
================================
JSONPlaceholder API仕様に基づいたログイン専用検証（Aルート）
・実際は /posts 作成APIのためtokenは存在しない
・入力パターン検証として利用
・レスポンス構造は id ベースで検証する
================================
*/

/*
ログイン系POST成功時の期待ステータス
（JSONPlaceholderではPOST成功時に201返却）
*/
const LOGIN_SUCCESS_STATUS = 201;

/*
================================
内部ヘルパー（login専用）
================================
*/

/*
レスポンスにidが存在するか検証
（JSONPlaceholderでは作成成功時にidが返却される）
*/
async function expectCreatedIdExists(response: APIResponse) {
  const body = await response.json();
  expect(body?.id).toBeTruthy();
}

/*
レスポンス構造の最低限チェック
*/
async function expectResponseStructure(response: APIResponse) {
  const body = await response.json();
  expect(body).toBeDefined();
}

/*
================================
正常系：ログイン成功
================================
レスポンス:
・status 201
・作成されたリソースのidが存在すること
*/
export async function expectLoginSuccess(response: APIResponse) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);
  await expectCreatedIdExists(response);
}

/*
================================
入力パターン：password未入力
================================
レスポンス:
・status 201
・レスポンス構造が存在すること
================================
*/
export async function expectMissingPasswordPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);
  await expectResponseStructure(response);
}

/*
================================
入力パターン：email未入力
================================
レスポンス:
・status 201
・レスポンス構造が存在すること
================================
*/
export async function expectMissingEmailPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);
  await expectResponseStructure(response);
}

/*
================================
入力パターン：空リクエスト
================================
レスポンス:
・status 201
・レスポンス構造が存在すること
================================
*/
export async function expectEmptyRequestPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);
  await expectResponseStructure(response);
}

/*
================================
入力パターン：不正パスワード
================================
レスポンス:
・status 201
・作成されたリソースのidが存在すること
================================
*/
export async function expectWrongPasswordPattern(
  response: APIResponse
) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);
  await expectCreatedIdExists(response);
}
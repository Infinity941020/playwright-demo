// Playwright APIレスポンス型
import { APIResponse, expect } from '@playwright/test';

// 共通ステータス検証ロジックを使用
import { expectStatus } from './commonAssertions';

/*
================================
Login API Assertions
================================
JSONPlaceholder API仕様に基づいたログイン専用検証（Aルート）
・実際は /posts 作成APIのためtokenは存在しない
・成功/失敗/特殊ケースをまとめる
・レスポンス構造は id ベースで検証する
================================
*/

/*
ログイン成功時の期待ステータス（JSONPlaceholderでは201）
*/
const LOGIN_SUCCESS_STATUS = 201;

/*
バリデーションエラー時の期待ステータス
*/
const LOGIN_ERROR_STATUS = 400;

/*
================================
内部ヘルパー（login専用）
================================
*/

/*
レスポンスにerrorメッセージが含まれているか検証
*/
async function expectErrorMessage(
  response: APIResponse,
  expectedMessage: string
) {
  const body = await response.json();
  expect(body?.error ?? '').toContain(expectedMessage);
}

/*
レスポンスにidが存在するか検証
（JSONPlaceholderではtokenの代わりにidが返る）
*/
async function expectCreatedIdExists(response: APIResponse) {
  const body = await response.json();
  expect(body?.id).toBeTruthy();
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
異常系：password未入力
================================
レスポンス:
・status 400
・error: Missing password
*/
export async function expectMissingPasswordError(response: APIResponse) {
  expectStatus(response, LOGIN_ERROR_STATUS);
  await expectErrorMessage(response, 'Missing password');
}

/*
================================
異常系：email未入力
================================
レスポンス:
・status 400
・error: Missing email or username
*/
export async function expectMissingEmailError(response: APIResponse) {
  expectStatus(response, LOGIN_ERROR_STATUS);
  await expectErrorMessage(response, 'Missing email or username');
}

/*
================================
異常系：空リクエスト
================================
レスポンス:
・status 400
・errorフィールドの存在確認
*/
export async function expectEmptyRequestError(response: APIResponse) {
  expectStatus(response, LOGIN_ERROR_STATUS);

  const body = await response.json();
  expect(body?.error).toBeDefined();
}

/*
================================
特殊ケース：不正パスワード
================================
JSONPlaceholder仕様では成功扱い（201 + id返却）
*/
export async function expectWrongPasswordSuccess(response: APIResponse) {
  expectStatus(response, LOGIN_SUCCESS_STATUS);
  await expectCreatedIdExists(response);
}
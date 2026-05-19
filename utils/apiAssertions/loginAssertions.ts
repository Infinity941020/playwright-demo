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
・成功/失敗/特殊ケースをまとめる
・レスポンス構造は id ベースで検証する
================================
*/

/*
ログイン成功時の期待ステータス（JSONPlaceholderでは201）
*/
const LOGIN_SUCCESS_STATUS = 201;

/*
バリデーション系の期待ステータス（環境依存）
*/
const LOGIN_ERROR_STATUS = 400;

/*
================================
内部ヘルパー（login専用）
================================
*/

/*
レスポンスにidが存在するか検証
（JSONPlaceholderではtokenの代わりにidが返る）
*/
async function expectCreatedIdExists(response: APIResponse) {
  const body = await response.json();
  expect(body?.id).toBeTruthy();
}

/*
レスポンス構造の最低限チェック（異常系共通）
※JSONPlaceholderではエラー構造保証がないため安全側で検証
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
異常系：password未入力
================================
レスポンス:
・構造としてレスポンスが存在すること
（API仕様依存を排除した軽量検証）
*/
export async function expectMissingPasswordError(response: APIResponse) {
  expectStatus(response, LOGIN_ERROR_STATUS);
  await expectResponseStructure(response);
}

/*
================================
異常系：email未入力
================================
レスポンス:
・構造としてレスポンスが存在すること
*/
export async function expectMissingEmailError(response: APIResponse) {
  expectStatus(response, LOGIN_ERROR_STATUS);
  await expectResponseStructure(response);
}

/*
================================
異常系：空リクエスト
================================
レスポンス:
・構造としてレスポンスが存在すること
*/
export async function expectEmptyRequestError(response: APIResponse) {
  expectStatus(response, LOGIN_ERROR_STATUS);
  await expectResponseStructure(response);
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
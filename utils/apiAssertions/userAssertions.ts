// Playwright APIレスポンス型（APIレスポンスの型定義とexpectを使用）
import { APIResponse, expect } from '@playwright/test';

// 共通ステータス検証ロジック（HTTPステータス検証の共通化）
import { expectStatus } from './commonAssertions';

/*
================================
User API Assertions
================================
JSONPlaceholder API仕様に基づいたユーザー取得専用検証（Aルート）
・レスポンスは body直下にユーザー情報が存在
・dataラップ構造は存在しない
・Login Assertionsと同一フォーマットで統一
================================
*/

/*
User取得成功時の期待ステータス
*/
const USER_SUCCESS_STATUS = 200;

/*
User未存在時の期待ステータス
*/
const USER_NOT_FOUND_STATUS = 404;

/*
================================
内部ヘルパー（user専用）
================================
*/

/*
ユーザー情報構造チェック
*/
async function expectUserStructure(
  response: APIResponse
) {
  const body = await response.json();

  /*
  レスポンス存在チェック
  */
  expect(body).toBeDefined();

  /*
  ユーザー情報の基本項目チェック
  */
  expect(body?.id).toBeTruthy();
  expect(body?.name).toBeTruthy();
  expect(body?.email).toBeTruthy();
}

/*
空レスポンス構造チェック
*/
async function expectEmptyStructure(
  response: APIResponse
) {
  const body = await response.json();

  /*
  JSONPlaceholderでは
  未存在ユーザー取得時に
  空オブジェクトが返る
  */
  expect(body).toBeDefined();
}

/*
================================
正常系：単一ユーザー取得
================================
レスポンス:
・status 200
・ユーザー情報が存在すること
・必要項目（id / name / email）が存在すること
================================
*/
export async function expectSingleUserResponse(
  response: APIResponse
) {
  expectStatus(response, USER_SUCCESS_STATUS);

  await expectUserStructure(response);
}

/*
================================
取得パターン：存在しないユーザー
================================
レスポンス:
・status 404
・空レスポンス構造確認
================================
*/
export async function expectUserNotFoundPattern(
  response: APIResponse
) {
  expectStatus(response, USER_NOT_FOUND_STATUS);

  await expectEmptyStructure(response);
}
// APIアサーション集（Login完成 + User追加対応版：共通設計＋横展開可能構造）

// Playwrightのアサーション機能とAPIレスポンスタイプを利用するためのインポート
import { expect, APIResponse } from '@playwright/test';

/*
================================
共通アサーション
================================
*/

/**
 * レスポンスステータスコード検証
 */
export function expectStatus(
  response: APIResponse,
  expectedStatus: number
) {
  expect(response.status()).toBe(expectedStatus);
}

/**
 * エラーメッセージ検証（errorフィールド前提）
 */
export async function expectErrorMessage(
  response: APIResponse,
  message: string
) {
  const body = await response.json();
  expect(body.error).toContain(message);
}

/**
 * token存在確認（Login成功系など）
 */
export async function expectTokenExists(response: APIResponse) {
  const body = await response.json();
  expect(body.token).toBeTruthy();
}


/*
================================
Login（完成済み）
================================
*/

/**
 * 正常ログイン成功（200 + token）
 */
export async function expectLoginSuccess(response: APIResponse) {
  expectStatus(response, 200);
  await expectTokenExists(response);
}

/**
 * password未入力エラー
 */
export async function expectMissingPasswordError(response: APIResponse) {
  expectStatus(response, 400);
  await expectErrorMessage(response, 'Missing password');
}

/**
 * email未入力エラー
 */
export async function expectMissingEmailError(response: APIResponse) {
  expectStatus(response, 400);
  await expectErrorMessage(response, 'Missing email');
}

/**
 * 空リクエストエラー（email or username不足）
 */
export async function expectEmptyRequestError(response: APIResponse) {
  expectStatus(response, 400);
  await expectErrorMessage(response, 'Missing email or username');
}

/**
 * 不正パスワードでも成功扱い（ReqRes仕様）
 */
export async function expectWrongPasswordSuccess(response: APIResponse) {
  expectStatus(response, 200);
  await expectTokenExists(response);
}


/*
================================
User（新規追加：完成形ベース）
================================
*/

/**
 * User取得成功レスポンス検証
 * - status 200
 * - data構造存在確認
 */
export async function expectUserResponse(response: APIResponse) {
  expectStatus(response, 200);

  const body = await response.json();

  // dataオブジェクト存在チェック
  expect(body.data).toBeTruthy();

  // 必須フィールド検証
  expect(body.data.id).toBeTruthy();
  expect(body.data.email).toBeTruthy();
  expect(body.data.first_name).toBeTruthy();
  expect(body.data.last_name).toBeTruthy();
}

/**
 * User not found（将来拡張用）
 */
export async function expectUserNotFound(response: APIResponse) {
  expectStatus(response, 404);

  const body = await response.json();
  expect(body.error).toBeTruthy();
}
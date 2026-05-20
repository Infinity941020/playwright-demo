// Playwrightのexpectを使用（アサーション基盤）
import { expect, APIResponse } from '@playwright/test';

/*
================================
Common Assertions
================================
複数APIで共通利用する最小限の検証ロジック
・HTTPステータス検証
・レスポンス構造検証
・作成系共通検証
================================
*/

/*
================================
HTTPステータス検証
================================
*/
export function expectStatus(
  response: APIResponse,
  expectedStatus: number
) {

  expect(response.status()).toBe(expectedStatus);
}

/*
================================
レスポンスBody存在確認
================================
*/
export function expectResponseBody(
  body: any
) {

  expect(body).toBeDefined();
}

/*
================================
作成系レスポンス検証
================================
・POST系共通
・id生成確認
================================
*/
export function expectCreatedResource(
  body: any
) {

  expectResponseBody(body);

  expect(body.id).toBeDefined();
}
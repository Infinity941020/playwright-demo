// Playwrightのexpectを使用（アサーション基盤）
import { expect, APIResponse } from '@playwright/test';

/*
================================
Common Assertions
================================
複数APIで共通利用する最小限の検証ロジック
・HTTPステータス検証のみ管理
・API個別ロジックは持たない
・正常系/入力パターン検証の両方で利用
================================
*/

/*
HTTPレスポンスのステータスコードが
期待値と一致するか検証
*/
export function expectStatus(
  response: APIResponse,
  expectedStatus: number
) {
  expect(response.status()).toBe(expectedStatus);
}
// Playwrightのexpectを使用（アサーション基盤）
import { expect, APIResponse } from '@playwright/test';

/*
================================
Common Assertions
================================
複数APIで共通利用する最小限の検証ロジック
・HTTPステータス検証
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
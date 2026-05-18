 // Playwrightのexpectを使用（アサーションの基盤）
import { expect, APIResponse } from '@playwright/test';

/*
================================
Common Assertions
================================
複数APIで共通して使う最小限の検証ロジック
・ステータスコード検証のみ管理
・API個別ロジックは持たない
================================
*/

// HTTPレスポンスのステータスコードが期待値と一致するか検証
export function expectStatus(
  response: APIResponse,
  expectedStatus: number
) {
  expect(response.status()).toBe(expectedStatus);
}
/*
================================
User API Assertions
================================
*/

// Playwright APIレスポンス型とアサーション用expectを使用
import { APIResponse, expect } from '@playwright/test'; 

/*
================================
User API Assertions
================================
JSONPlaceholder API仕様に基づいたユーザー取得専用検証（Aルート）
・レスポンスは body直下にユーザー情報が存在
・dataラップ構造は存在しない
・loginAssertionsと同一フォーマットで統一
================================
*/

/*
================================
正常系：単一ユーザー取得
================================
レスポンス:
・status 200
・ユーザー情報が存在すること
・必要項目（id / name / email）が存在すること
*/
export async function expectSingleUserResponse(response: APIResponse) {
  expect(response.status()).toBe(200);

  const body = await response.json();
  // レスポンスボディ取得（JSON形式）

  /*
  レスポンス存在チェック
  */
  expect(body).toBeTruthy();

  /*
  ユーザー情報の基本項目チェック
  */
  expect(body.id).toBeTruthy();
  expect(body.name).toBeTruthy();
  expect(body.email).toBeTruthy();
}
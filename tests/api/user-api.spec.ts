// User APIテスト（完成形リファクタ版：Loginと完全同一構造・アサーション統一済み）

// Playwrightのテストランナー機能を利用するためのインポート（test / describe / fixture などを提供）
import { test } from '@playwright/test';

// API実行ヘルパー（共通GET）
import { executeGetApi } from '../../utils/apiHelper';

// API Assertions（User完成形アサーションを利用）
import {
  expectUserResponse
} from '../../utils/apiAssertions';


/*
================================
User APIテスト（完成形）
================================
*/

test.describe('User APIテスト', () => {

  /*
  ================================
  正常系：単一ユーザー取得
  ================================
  */

  test('単一ユーザー情報を取得できること', async ({ request }) => {

    // User API実行（ユーザーID=2固定）
    const response = await executeGetApi(
      request,
      '/users/2'
    );

    // レスポンス確認（デバッグ用）
    console.log(await response.text());

    // 完全検証（ステータス + データ構造 + 必須フィールド）
    await expectUserResponse(response);
  });

});
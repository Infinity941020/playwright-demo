// Playwright test / expect
import { test, expect } from '@playwright/test';

// APIテスト用データ
import { apiUsers } from '../../data/apiUsers';

// API共通設定
import { API_BASE_URL, API_KEY } from '../../utils/apiConfig';

/*
================================
Login APIテスト
================================
*/

// Login APIテストグループ
test.describe('Login APIテスト', () => {

  /*
  ================================
  正常系ログインAPI
  ================================
  */

  // 正常ログインAPI検証
  test('正常なログインリクエスト', async ({ request }) => {

    // Login APIへPOSTリクエスト送信
    const response = await request.post(`${API_BASE_URL}/login`, {

      // API Key header
      headers: {
        'x-api-key': API_KEY
      },

      // request body
      data: apiUsers.validUser
    });

    // response内容確認
    console.log(await response.text());

    // status code検証
    expect(response.status()).toBe(200);

    // response body取得
    const body = await response.json();

    // token存在確認
    expect(body.token).toBeTruthy();
  });

  /*
  ================================
  異常系ログインAPI（password未入力）
  ================================
  */

  // password未入力時の異常系検証
  test('password未入力時に400エラーになること', async ({ request }) => {

    // Login API実行
    const response = await request.post(`${API_BASE_URL}/login`, {

      // API Key header
      headers: {
        'x-api-key': API_KEY
      },

      // password未指定request body
      data: apiUsers.missingPasswordUser
    });

    // response確認
    console.log(await response.text());

    // status code検証
    expect(response.status()).toBe(400);

    // response body取得
    const body = await response.json();

    // error message確認
    expect(body.error).toContain('Missing password');
  });
});
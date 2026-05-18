/*
================================
Login APIテスト
（jsonplaceholder対応・フェーズ1完成版）
================================
*/

// Playwrightテストランナー
import { test } from '@playwright/test';

// テストデータ
import { apiUsers } from '../../data/apiUsers';

// API実行ヘルパー
import { executeLoginApi } from '../../utils/apiHelper';

// Assertions（簡素化後）
import {
  expectLoginSuccess
} from '../../utils/apiAssertions/loginAssertions';

/*
================================
Login APIテスト
================================
*/
test.describe('Login APIテスト', () => {

  /*
  ================================
  正常系（POSTテスト）
  ================================
  */
  test('正常ログイン（POST作成成功）', async ({ request }) => {

    const response = await executeLoginApi(
      request,
      apiUsers.validUser
    );

    console.log(await response.text());

    await expectLoginSuccess(response);
  });

});
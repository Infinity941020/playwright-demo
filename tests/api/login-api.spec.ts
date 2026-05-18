// Login APIテスト（完成テンプレ版：共通アサーション統一・ReqRes仕様対応）

// Playwrightのテストランナー機能を利用するためのインポート（test / describe / fixture などを提供）
import { test } from '@playwright/test';

// テストデータ
import { apiUsers } from '../../data/apiUsers';

// API実行ヘルパー
import { executeLoginApi } from '../../utils/apiHelper';

// API Assertions（完成テンプレ版）
import {
  expectLoginSuccess,
  expectMissingPasswordError,
  expectMissingEmailError,
  expectEmptyRequestError,
  expectWrongPasswordSuccess
} from '../../utils/apiAssertions';


/*
================================
Login APIテスト（完成テンプレ）
================================
*/

test.describe('Login APIテスト', () => {

  /*
  ================================
  正常系
  ================================
  */

  test('正常ログイン（token取得）', async ({ request }) => {

    // Login API実行
    const response = await executeLoginApi(
      request,
      apiUsers.validUser
    );

    // レスポンス確認（デバッグ）
    console.log(await response.text());

    // 成功検証（status + token）
    await expectLoginSuccess(response);
  });


  /*
  ================================
  異常系：password未入力
  ================================
  */

  test('password未入力 → 400エラー', async ({ request }) => {

    // Login API実行（passwordなし）
    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.missingPassword
    );

    console.log(await response.text());

    // password未入力検証
    await expectMissingPasswordError(response);
  });


  /*
  ================================
  異常系：email未入力
  ================================
  */

  test('email未入力 → 400エラー', async ({ request }) => {

    // Login API実行（emailなし）
    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.missingEmail
    );

    console.log(await response.text());

    // email未入力検証
    await expectMissingEmailError(response);
  });


  /*
  ================================
  異常系：空リクエスト
  ================================
  */

  test('空リクエスト → 400エラー', async ({ request }) => {

    // Login API実行（空）
    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.emptyRequest
    );

    console.log(await response.text());

    // 空リクエスト検証
    await expectEmptyRequestError(response);
  });


  /*
  ================================
  特殊ケース：不正パスワード
  （ReqRes仕様：成功扱い）
  ================================
  */

  test('不正パスワード → 成功扱い（ReqRes仕様）', async ({ request }) => {

    // Login API実行（不正パスワード）
    const response = await executeLoginApi(
      request,
      apiUsers.invalidUsers.wrongPassword
    );

    console.log(await response.text());

    // ReqRes仕様：200 + token返却
    await expectWrongPasswordSuccess(response);
  });

});
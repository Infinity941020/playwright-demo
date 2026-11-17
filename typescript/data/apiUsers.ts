/*
================================
APIテスト用ユーザーデータ（Aルート統一）
================================
・JSONPlaceholder前提のテストデータ管理
・API実行時のpayload生成に使用
・正常系/入力パターンを集約
================================
*/

export const apiUsers = {

  /*
  =================================
  正常系ユーザー
  =================================
  ・POST成功パターン用
  ・JSONPlaceholderでは作成成功扱い
  */
  validUser: {
    email: 'test@example.com',
    password: 'password123'
  },

  /*
  =================================
  入力パターン検証用データ群
  =================================
  ・JSONPlaceholder前提の入力パターン検証用
  ・HTTPエラーではなくpayload差分確認として利用
  */
  inputPatterns: {

    /*
    password未入力
    */
    missingPassword: {
      email: 'test@example.com'
    },

    /*
    email未入力
    */
    missingEmail: {
      password: 'password123'
    },

    /*
    空リクエスト
    */
    emptyRequest: {},

    /*
    不正パスワード入力
    */
    wrongPassword: {
      email: 'test@example.com',
      password: 'wrong-password'
    }
  }
};
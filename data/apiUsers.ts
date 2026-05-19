/*
================================
APIテスト用ユーザーデータ（Aルート統一）
================================
・JSONPlaceholder前提のテストデータ管理
・API実行時のpayload生成に使用
・異常系/正常系の入力パターンを集約
================================
*/

export const apiUsers = {

  /*
  =================================
  正常系ユーザー
  =================================
  ・ログイン成功パターン想定
  ・JSONPlaceholderではPOST成功として扱う
  */
  validUser: {
    email: 'test@example.com',
    password: 'password123'
  },

  /*
  =================================
  異常系ユーザー群
  =================================
  ・入力バリデーション検証用
  ・APIのエラーハンドリング確認用
  */
  invalidUsers: {

    /*
    パスワード未入力ケース
    */
    missingPassword: {
      email: 'test@example.com'
    },

    /*
    メール未入力ケース
    */
    missingEmail: {
      password: 'password123'
    },

    /*
    空リクエストケース
    */
    emptyRequest: {},

    /*
    誤ったパスワードケース
    */
    wrongPassword: {
      email: 'test@example.com',
      password: 'wrong-password'
    }
  }
};
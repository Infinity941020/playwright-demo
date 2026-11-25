/*
================================
APIテスト用ユーザーデータ（Aルート統一）
================================
・JSONPlaceholder前提のテストデータ管理
・API実行時のpayload生成に使用
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
};
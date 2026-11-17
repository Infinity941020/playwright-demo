// ========================================
// ログインユーザー情報
// ========================================

// テスト用ログインユーザー定義
export const users = {

  // 正常ログイン可能ユーザー
  standard: {

    username: 'standard_user',
    password: 'secret_sauce',
  },

  // ログイン不可（ロック済み）ユーザー
  locked: {

    username: 'locked_out_user',
    password: 'secret_sauce',
  },

  // 異常系テスト用（存在しないユーザー）
  invalid: {

    username: 'wrong_user',
    password: 'wrong_pass',
  },
} as const;
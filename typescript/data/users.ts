// ========================================
// ログインユーザー情報
// ========================================

// 値は両版共通の shared/data/users.json に置いている（decisions.md 論点24）
import sharedUsers from '../../shared/data/users.json' with { type: 'json' };

// ユーザー名とパスワードの組
type User = {
  readonly username: string;
  readonly password: string;
};

// テスト用ログインユーザー定義
export const users: {
  readonly standard: User;
  readonly locked: User;
  readonly invalid: User;
} = {

  // 正常ログイン可能ユーザー
  standard: sharedUsers.standard,

  // ログイン不可（ロック済み）ユーザー
  locked: sharedUsers.locked,

  // 異常系テスト用（存在しないユーザー。ユーザー名・パスワードとも誤り）
  invalid: sharedUsers.wrong_both,
};
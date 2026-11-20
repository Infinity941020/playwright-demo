// ログインに使うユーザー名とパスワード。
// 値は両版共通の shared/data/users.json にあり、ここでは名前の書き方だけを TypeScript の書き方に直して渡す
import sharedUsers from '../../shared/data/users.json' with { type: 'json' };

type User = {
  readonly username: string;
  readonly password: string;
};

export const users: {
  readonly standard: User;
  readonly locked: User;
  readonly wrongUsernameOnly: User;
  readonly wrongPasswordOnly: User;
} = {

  // ログインに成功するユーザー
  standard: sharedUsers.standard,

  // ロックされていて、ログインできないユーザー
  locked: sharedUsers.locked,

  // ユーザー名だけが誤っている組（存在しないユーザー名）
  wrongUsernameOnly: sharedUsers.wrong_username_only,

  // パスワードだけが誤っている組
  wrongPasswordOnly: sharedUsers.wrong_password_only,
};

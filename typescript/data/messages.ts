// 画面に表示されるエラーの文言。
// 値は両版共通の shared/data/messages.json にあり、ここでは名前の書き方だけを TypeScript の書き方に直して渡す。
// 文言を直すときは、ここではなく messages.json を、テストケースの期待結果に合わせて直す
import sharedMessages from '../../shared/data/messages.json' with { type: 'json' };

export const messages: {
  readonly login: {
    readonly usernameRequired: string;
    readonly passwordRequired: string;
    readonly credentialsMismatch: string;
    readonly lockedOut: string;
    readonly notLoggedIn: string;
  };
} = {

  login: {
    usernameRequired: sharedMessages.login.username_required,
    passwordRequired: sharedMessages.login.password_required,
    credentialsMismatch: sharedMessages.login.credentials_mismatch,
    lockedOut: sharedMessages.login.locked_out,

    // ログインせずに画面を開いたときの文言。{path} の所に、開いた画面のパス（例：/inventory.html）を入れて使う
    notLoggedIn: sharedMessages.login.not_logged_in,
  },
};

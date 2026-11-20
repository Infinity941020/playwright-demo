// 画面に表示されるエラーの文言。
// 値は両版共通の shared/data/messages.json にあり、ここでは名前の書き方だけを TypeScript の書き方に直して渡す。
// 文言は、各画面のテストケースの期待結果と一字一句同じにする
import sharedMessages from '../../shared/data/messages.json' with { type: 'json' };

export const messages: {
  readonly login: {
    readonly usernameRequired: string;
    readonly passwordRequired: string;
    readonly credentialsMismatch: string;
    readonly lockedOut: string;
    readonly notLoggedIn: string;
  };
  readonly checkout: {
    readonly firstNameRequired: string;
    readonly lastNameRequired: string;
    readonly postalCodeRequired: string;
  };
} = {

  login: {
    usernameRequired: sharedMessages.login.username_required,
    passwordRequired: sharedMessages.login.password_required,
    credentialsMismatch: sharedMessages.login.credentials_mismatch,
    lockedOut: sharedMessages.login.locked_out,

    // 未ログインで開いたときの文言。{path} の所に画面のパス（例：/cart.html）を入れて使う
    notLoggedIn: sharedMessages.login.not_logged_in,
  },

  checkout: {
    firstNameRequired: sharedMessages.checkout.first_name_required,
    lastNameRequired: sharedMessages.checkout.last_name_required,
    postalCodeRequired: sharedMessages.checkout.postal_code_required,
  },
};

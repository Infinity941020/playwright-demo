// モックが返す値（正しい認証情報、トークン、ユーザーの値、エラーの文言など）。
// 値は両版共通の shared/data/api_mock.json にあり、ここでは項目名の書き方を TypeScript の書き方（firstName など）に直して渡す。
// ただしユーザーの値は、返事の本文にそのまま入れるものなので、JSON の項目名のまま、まとめて渡す
// （JSON に項目を足したときに、両版の返事がずれないようにするため）。
// テストの期待値はここから読まず、テストケースと同じ値をテストに書く（モックの値の誤りにテストが気づけるようにするため）
import sharedApiMock from '../../shared/data/api_mock.json' with { type: 'json' };

export const mockData = {

  login: {
    validEmail: sharedApiMock.login.valid_email,
    validPassword: sharedApiMock.login.valid_password,
    token: sharedApiMock.login.token,
    userNotFoundError: sharedApiMock.login.user_not_found_error,
  },

  user: {
    existingUser: sharedApiMock.user.existing_user,
  },

  cart: {
    invalidPayloadError: sharedApiMock.cart.invalid_payload_error,
  },

  checkout: {
    invalidPayloadError: sharedApiMock.checkout.invalid_payload_error,
    callLimit: sharedApiMock.checkout.call_limit,
    callLimitError: sharedApiMock.checkout.call_limit_error,
    callLimitMessage: sharedApiMock.checkout.call_limit_message,
  },

  logout: {
    unauthorizedError: sharedApiMock.logout.unauthorized_error,
    invalidRequestError: sharedApiMock.logout.invalid_request_error,
  },

  server: {
    noHandlerError: sharedApiMock.server.no_handler_error,
  },
} as const;

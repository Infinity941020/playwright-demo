import { type Handler, type MockRequest, type MockResponse, isObject } from '../handlerTypes';
import { mockData } from '../mockData';

// ログインの API。正しいメールアドレスとパスワードのときだけトークンを返す
export function createLoginHandlers(): Handler[] {

  function login(request: MockRequest): MockResponse {

    const body = request.json();

    if (
      isObject(body) &&
      body.email === mockData.login.validEmail &&
      body.password === mockData.login.validPassword
    ) {
      return { status: 200, body: { token: mockData.login.token } };
    }

    return { status: 400, body: { error: mockData.login.userNotFoundError } };
  }

  return [{ method: 'POST', path: '/api/login', resolver: login }];
}

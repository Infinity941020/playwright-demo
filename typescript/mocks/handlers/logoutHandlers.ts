import { type Handler, type MockRequest, type MockResponse, isObject } from '../handlerTypes';
import { mockData } from '../mockData';

// 本文が空でないかどうか。中身のあるオブジェクト・配列・文字列だけを「空でない」とみなす
function isNonEmptyBody(body: unknown): boolean {

  if (typeof body === 'string' || Array.isArray(body)) {
    return body.length > 0;
  }

  return isObject(body) && Object.keys(body).length > 0;
}

// ログアウトの API。トークンがあり、本文が空のときだけ成功する
export function createLogoutHandlers(): Handler[] {

  function logout(request: MockRequest): MockResponse {

    if (!request.header('Authorization')) {
      return { status: 401, body: { error: mockData.logout.unauthorizedError } };
    }

    // JSON として読めない本文は、本文なしとみなす
    let body: unknown;

    try {
      body = request.json();
    } catch {
      body = null;
    }

    if (isNonEmptyBody(body)) {
      return { status: 400, body: { error: mockData.logout.invalidRequestError } };
    }

    return { status: 200, body: { success: true } };
  }

  return [{ method: 'POST', path: '/api/logout', resolver: logout }];
}

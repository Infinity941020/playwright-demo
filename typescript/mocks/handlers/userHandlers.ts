import { type Handler, type MockRequest, type MockResponse, toNumber } from '../handlerTypes';
import { mockData } from '../mockData';

// ユーザーの情報を返す API。登録しているユーザーは1人だけで、それ以外の id は存在しないユーザーとして 404 を返す
export function createUserHandlers(): Handler[] {

  function getUser(request: MockRequest): MockResponse {

    const user = mockData.user.existingUser;

    if (toNumber(request.params.id) === user.id) {
      return { status: 200, body: { data: { ...user } } };
    }

    return { status: 404, body: {} };
  }

  return [{ method: 'GET', path: '/api/users/{id}', resolver: getUser }];
}

import { http, HttpResponse } from 'msw';

/*
================================
Logout Mock API
================================
ステートレス設計（Fixture前提）
================================
*/

/*
================================
API URL
================================
*/
const LOGOUT_API_URL = 'http://localhost/api/logout';

/*
================================
Logout Handlers
================================
*/
export const logoutHandlers = [
  http.post(LOGOUT_API_URL, async ({ request }) => {

    /*
    ================================
    Authorizationチェック
    ================================
    */
    const auth = request.headers.get('authorization');

    if (!auth) {
      return HttpResponse.json(
        {
          error: 'unauthorized',
        },
        {
          status: 401,
        }
      );
    }

    /*
    ================================
    bodyチェック（保険）
    ================================
    */
    const body = await request.json().catch(() => null);

    if (body && Object.keys(body).length > 0) {
      return HttpResponse.json(
        {
          error: 'invalid request',
        },
        {
          status: 400,
        }
      );
    }

    /*
    ================================
    成功レスポンス
    ================================
    */
    return HttpResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    );
  }),
];
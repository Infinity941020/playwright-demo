import { http, HttpResponse } from 'msw';

/*
================================
Login Mock Handlers
================================
*/

export const loginHandlers = [

  /*
  =================================
  ログインAPI（MSW化・localhost統一）
  =================================
  */
  http.post(
    'http://localhost/api/login',
    async ({ request }) => {

      const body = await request.json() as {
        email?: string;
        password?: string;
      };

      /*
      =================================
      正常ログイン
      =================================
      */
      if (
        body.email === 'test@example.com' &&
        body.password === 'password123'
      ) {
        return HttpResponse.json(
          {
            token: 'mock-token',
          },
          {
            status: 200,
          }
        );
      }

      /*
      =================================
      異常ログイン
      =================================
      */
      return HttpResponse.json(
        {
          error: 'user not found',
        },
        {
          status: 400,
        }
      );
    }
  ),
];
import { http, HttpResponse } from 'msw';

/*
================================
Login Mock Handlers
================================
*/

export const loginHandlers = [

  /*
  =================================
  ログインAPI
  =================================
  */
  http.post(
    'https://reqres.in/api/login',
    async ({ request }) => {

      const body = await request.json() as {
        email?: string;
        password?: string;
      };

      /*
      =================================
      正常ログイン
      apiUsers.validUser と一致
      =================================
      */
      if (
        body.email === 'test@example.com' &&
        body.password === 'password123'
      ) {

        return HttpResponse.json(
          {
            token: 'mock-token'
          },
          {
            status: 200
          }
        );
      }

      /*
      =================================
      ログイン失敗
      =================================
      */
      return HttpResponse.json(
        {
          error: 'user not found'
        },
        {
          status: 400
        }
      );
    }
  ),
];
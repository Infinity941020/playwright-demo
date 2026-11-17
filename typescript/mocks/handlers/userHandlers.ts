import { http, HttpResponse } from 'msw';

/*
================================
User Mock Handlers
================================
*/

export const userHandlers = [

  /*
  =================================
  User取得API
  =================================
  */
  http.get(
    'http://localhost/api/users/:id',
    async ({ params }) => {

      const id = Number(params.id);

      /*
      =================================
      正常系：ユーザー取得成功
      =================================
      */
      if (id === 2) {

        return HttpResponse.json(
          {
            data: {
              id: 2,
              email: 'janet.weaver@reqres.in',
              first_name: 'Janet',
              last_name: 'Weaver',
              avatar: 'https://reqres.in/img/faces/2-image.jpg',
            }
          },
          {
            status: 200
          }
        );
      }

      /*
      =================================
      異常系：存在しないユーザー
      =================================
      */
      return HttpResponse.json(
        {},
        {
          status: 404
        }
      );
    }
  ),
];
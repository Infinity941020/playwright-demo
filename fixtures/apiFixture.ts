import { test as base } from '@playwright/test';

// API実行ヘルパー
import {
  executeLoginApi,
  executeAddCartApi,
  executeGetCartApi,
  executeDeleteCartApi
} from '../utils/apiHelper';

/*
================================
API Fixture
================================
Login / Cart API版
================================
*/

/*
================================
Fixture型定義
================================
*/
type ApiFixture = {

  /*
  ================================
  API Client
  ================================
  */
  api: {

    /*
    ================================
    Login API実行
    ================================
    */
    login: (
      payload: Record<string, any>
    ) => ReturnType<typeof executeLoginApi>;

    /*
    ================================
    Cart API
    ================================
    */
    cart: {

      /*
      ----------------------------
      Cart追加
      ----------------------------
      */
      add: (
        payload: Record<string, any>
      ) => ReturnType<typeof executeAddCartApi>;

      /*
      ----------------------------
      Cart一覧取得
      ----------------------------
      */
      get: () => ReturnType<typeof executeGetCartApi>;

      /*
      ----------------------------
      Cart削除
      ----------------------------
      */
      delete: (
        cartId: number
      ) => ReturnType<typeof executeDeleteCartApi>;
    };
  };
};

/*
================================
Fixture拡張
================================
*/
export const test = base.extend<ApiFixture>({

  /*
  ================================
  API Client生成
  ================================
  */
  api: async ({ request }, use) => {

    const apiClient = {

      /*
      ================================
      Login API実行
      ================================
      */
      login: (
        payload: Record<string, any>
      ) => executeLoginApi(
        request,
        payload
      ),

      /*
      ================================
      Cart API
      ================================
      */
      cart: {

        /*
        ----------------------------
        Cart追加
        ----------------------------
        */
        add: (
          payload: Record<string, any>
        ) => executeAddCartApi(
          request,
          payload
        ),

        /*
        ----------------------------
        Cart一覧取得
        ----------------------------
        */
        get: () => executeGetCartApi(
          request
        ),

        /*
        ----------------------------
        Cart削除
        ----------------------------
        */
        delete: (
          cartId: number
        ) => executeDeleteCartApi(
          request,
          cartId
        ),
      },
    };

    /*
    ================================
    API Client返却
    ================================
    */
    await use(apiClient);
  },
});

/*
================================
expect再export
================================
*/
export { expect } from '@playwright/test';
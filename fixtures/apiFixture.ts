/*
================================
API Fixture
================================
Login / Cart / Checkout / Logout API版
================================
*/

import { test as base } from '@playwright/test';

// API実行ヘルパー
import {
  executeLoginApi,
  executeAddCartApi,
  executeGetCartApi,
  executeDeleteCartApi,
  executeCheckoutApi,
  executeLogoutApi,
} from '../utils/apiHelper';

/*
================================
Fixture型定義
================================
*/
type ApiFixture = {

  api: {

    /*
    ================================
    Login API
    ================================
    */
    login: (payload: Record<string, any>) =>
      ReturnType<typeof executeLoginApi>;

    /*
    ================================
    Cart API
    ================================
    */
    cart: {
      add: (payload: Record<string, any>) =>
        ReturnType<typeof executeAddCartApi>;

      get: () =>
        ReturnType<typeof executeGetCartApi>;

      delete: (cartId: number) =>
        ReturnType<typeof executeDeleteCartApi>;
    };

    /*
    ================================
    Checkout API
    ================================
    */
    checkout: {
      create: (payload: Record<string, any>) =>
        ReturnType<typeof executeCheckoutApi>;
    };

    /*
    ================================
    Logout API
    ================================
    */
    logout: (payload: {
      body: Record<string, any>;
      token?: string;
    }) => ReturnType<typeof executeLogoutApi>;
  };
};

/*
================================
Fixture実装
================================
*/
export const test = base.extend<ApiFixture>({
  api: async ({ request }, use) => {

    const apiClient = {

      /*
      ================================
      Login API
      ================================
      */
      login: (payload: Record<string, any>) =>
        executeLoginApi(request, payload),

      /*
      ================================
      Cart API
      ================================
      */
      cart: {
        add: (payload: Record<string, any>) =>
          executeAddCartApi(request, payload),

        get: () =>
          executeGetCartApi(request),

        delete: (cartId: number) =>
          executeDeleteCartApi(request, cartId),
      },

      /*
      ================================
      Checkout API
      ================================
      */
      checkout: {
        create: (payload: Record<string, any>) =>
          executeCheckoutApi(request, payload),
      },

      /*
      ================================
      Logout API
      ================================
      */
      logout: ({ body, token }: {
        body: Record<string, any>;
        token?: string;
      }) =>
        executeLogoutApi(request, body, token),
    };

    await use(apiClient);
  },
});

export { expect } from '@playwright/test';
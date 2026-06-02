/*
================================
API Fixture
================================
Login / Cart / Checkout / Logout API版
================================
*/

import { APIResponse, test as base } from '@playwright/test';

// API実行ヘルパー
// Login / Cart / Checkout / Logout はすべてhelperに統一
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
    login: (
      payload: Record<string, unknown>
    ) => Promise<APIResponse>;

    /*
    ================================
    Cart API
    ================================
    */
    cart: {

      add: (
        payload: Record<string, unknown>
      ) => Promise<APIResponse>;

      get: () => Promise<APIResponse>;

      delete: (
        cartId: number
      ) => Promise<APIResponse>;
    };

    /*
    ================================
    Checkout API
    ================================
    */
    checkout: {

      create: (
        payload: Record<string, unknown>
      ) => Promise<APIResponse>;
    };

    /*
    ================================
    Logout API
    ================================
    */
    logout: (
      payload: {
        body: Record<string, unknown>;
        token?: string;
      }
    ) => Promise<APIResponse>;
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
      Login API（統一）
      ================================
      */
      login: (payload: Record<string, unknown>) =>
        executeLoginApi(request, payload),

      /*
      ================================
      Cart API（統一）
      ================================
      */
      cart: {
        add: (payload: Record<string, unknown>) =>
          executeAddCartApi(request, payload),

        get: () =>
          executeGetCartApi(request),

        delete: (cartId: number) =>
          executeDeleteCartApi(request, cartId),
      },

      /*
      ================================
      Checkout API（統一）
      ================================
      */
      checkout: {
        create: (payload: Record<string, unknown>) =>
          executeCheckoutApi(request, payload),
      },

      /*
      ================================
      Logout API（統一）
      ================================
      */
      logout: (payload: {
        body: Record<string, unknown>;
        token?: string;
      }) =>
        executeLogoutApi(request, payload.body, payload.token),
    };

    await use(apiClient);
  },
});

export { expect } from '@playwright/test';
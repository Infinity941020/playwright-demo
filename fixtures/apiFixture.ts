/*
================================
API Fixture
================================
*/

import { APIResponse, test as base } from '@playwright/test';

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
    login: (payload: Record<string, unknown>) => Promise<APIResponse>;

    cart: {
      add: (payload: Record<string, unknown>) => Promise<APIResponse>;
      get: () => Promise<APIResponse>;
      delete: (cartId: number) => Promise<APIResponse>;
    };

    checkout: {
      create: (payload: Record<string, unknown>) => Promise<APIResponse>;
    };

    logout: (payload?: {
      body?: Record<string, unknown>;
      token?: string;
    }) => Promise<APIResponse>;
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
      login: (payload: Record<string, unknown>) =>
        executeLoginApi(request, payload),

      cart: {
        add: (payload: Record<string, unknown>) =>
          executeAddCartApi(request, payload),

        get: () =>
          executeGetCartApi(request),

        delete: (cartId: number) =>
          executeDeleteCartApi(request, cartId),
      },

      checkout: {
        create: (payload: Record<string, unknown>) =>
          executeCheckoutApi(request, payload),
      },

      logout: (payload?: {
        body?: Record<string, unknown>;
        token?: string;
      }) =>
        executeLogoutApi(request, {
          body: payload?.body ?? {},
          token: payload?.token,
        }),
    };

    await use(apiClient);
  },
});

export { expect } from '@playwright/test';
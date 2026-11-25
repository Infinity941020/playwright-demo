import { APIRequestContext, APIResponse, test as base } from '@playwright/test';

import { MockServer } from '../mocks/server';

import {
  ApiPayload,
  LogoutPayload,
  executeLoginApi,
  executeGetUserApi,
  executeAddCartApi,
  executeGetCartApi,
  executeDeleteCartApi,
  executeCheckoutApi,
  executeLogoutApi,
} from '../utils/apiHelper';

// API のテストに、モックのサーバーと、そこにつながる通信の部品を渡す。
// - サーバーはテストごとに新しく立てて、テストの終わりに止める。状態（カートの中身、id の連番、購入の呼び出し回数）がテストをまたがないようにするため
// - 通信の部品は、そのサーバーを接続先にして作る。ブラウザは使わない

type ApiFixture = {

  // 立てたサーバーの接続先（例：http://127.0.0.1:50123）
  mockApiBaseUrl: string;

  apiRequestContext: APIRequestContext;

  // 本文に null を渡すと、本文なしで送る
  api: {
    login: (payload: ApiPayload) => Promise<APIResponse>;

    user: {
      get: (userId: number) => Promise<APIResponse>;
    };

    cart: {
      add: (payload: ApiPayload | null) => Promise<APIResponse>;
      get: () => Promise<APIResponse>;
      delete: (cartId: number) => Promise<APIResponse>;
    };

    checkout: {
      create: (payload: ApiPayload | null) => Promise<APIResponse>;
    };

    logout: (payload?: LogoutPayload) => Promise<APIResponse>;
  };
};

export const test = base.extend<ApiFixture>({

  mockApiBaseUrl: async ({}, use) => {

    const server = new MockServer();

    await server.start();

    try {
      await use(server.baseUrl);
    } finally {
      await server.stop();
    }
  },

  // サーバーより先に止まるよう、サーバーの接続先を受け取って作る
  apiRequestContext: async ({ playwright, mockApiBaseUrl }, use) => {

    const context = await playwright.request.newContext({ baseURL: mockApiBaseUrl });

    try {
      await use(context);
    } finally {
      await context.dispose();
    }
  },

  api: async ({ apiRequestContext }, use) => {

    await use({
      login: (payload) => executeLoginApi(apiRequestContext, payload),

      user: {
        get: (userId) => executeGetUserApi(apiRequestContext, userId),
      },

      cart: {
        add: (payload) => executeAddCartApi(apiRequestContext, payload),
        get: () => executeGetCartApi(apiRequestContext),
        delete: (cartId) => executeDeleteCartApi(apiRequestContext, cartId),
      },

      checkout: {
        create: (payload) => executeCheckoutApi(apiRequestContext, payload),
      },

      logout: (payload) => executeLogoutApi(apiRequestContext, payload),
    });
  },
});

export { expect } from '@playwright/test';

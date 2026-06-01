import { test as base } from '@playwright/test';

// API実行ヘルパー
import { executeLoginApi } from '../utils/apiHelper';

/*
================================
API Fixture
================================
Login API版
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
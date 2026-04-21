import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    storageState: 'auth.json',
    baseURL: 'https://www.saucedemo.com',
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
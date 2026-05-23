import { test } from '@playwright/test';

import { server } from '../../mocks/server';

/*
================================
MSW Setup
================================
*/

test.beforeAll(() => {
  server.listen();
});

test.afterEach(() => {
  server.resetHandlers();
});

test.afterAll(() => {
  server.close();
});
import { test } from '@playwright/test';
import { server } from '../../mocks/server';

/*
================================
MSW Setup
================================
*/

test.beforeAll(() => {

  server.listen({
    onUnhandledRequest: 'bypass',
  });
});

test.afterEach(() => {

  server.resetHandlers();
});

test.afterAll(() => {

  server.close();
});
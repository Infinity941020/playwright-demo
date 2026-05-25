import { setupServer } from 'msw/node';

import { loginHandlers } from './handlers/loginHandlers';
import { userHandlers } from './handlers/userHandlers';

/*
================================
MSW Server
================================
CI / Node / Playwright 共通対応版
================================
*/

/*
================================
Handler統合
================================
*/
const handlers = [
  ...loginHandlers,
  ...userHandlers,
];

/*
================================
MSW Server Instance
================================
*/
export const server = setupServer(
  ...handlers
);
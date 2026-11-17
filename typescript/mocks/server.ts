import { setupServer } from 'msw/node';

import { loginHandlers } from './handlers/loginHandlers';
import { userHandlers } from './handlers/userHandlers';
import { cartHandlers } from './handlers/cartHandlers';
import { checkoutHandlers } from './handlers/checkoutHandlers';
import { logoutHandlers } from './handlers/logoutHandlers';

/*
================================
MSW Server
================================
CI / Node / Playwright 共通
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
  ...cartHandlers,
  ...checkoutHandlers,
  ...logoutHandlers,
];

/*
================================
Server Instance
================================
*/
export const server = setupServer(...handlers);
import { setupServer } from 'msw/node';

import { loginHandlers } from './handlers/loginHandlers';
import { userHandlers } from './handlers/userHandlers';
import { cartHandlers } from './handlers/cartHandlers';
import { checkoutHandlers } from './handlers/checkoutHandlers';

/*
================================
MSW Server
================================
CI / Node / Playwright 共通対応版
================================
*/

/*
================================
Login Handler
================================
ReqRes Login API Mock
================================
*/
const loginMockHandlers = [
  ...loginHandlers,
];

/*
================================
User Handler
================================
ReqRes User API Mock
================================
*/
const userMockHandlers = [
  ...userHandlers,
];

/*
================================
Cart Handler
================================
MSW Cart API Mock
================================
*/
const cartMockHandlers = [
  ...cartHandlers,
];

/*
================================
Checkout Handler
================================
MSW Checkout API Mock
================================
*/
const checkoutMockHandlers = [
  ...checkoutHandlers,
];

/*
================================
Handler統合
================================
全MSW Handlerを統合
================================
*/
const handlers = [

  /*
  ----------------------------
  Login APIs
  ----------------------------
  */
  ...loginMockHandlers,

  /*
  ----------------------------
  User APIs
  ----------------------------
  */
  ...userMockHandlers,

  /*
  ----------------------------
  Cart APIs
  ----------------------------
  */
  ...cartMockHandlers,

  /*
  ----------------------------
  Checkout APIs
  ----------------------------
  */
  ...checkoutMockHandlers,
];

/*
================================
MSW Server Instance
================================
Playwright Node環境で使用
================================
*/
export const server = setupServer(
  ...handlers
);
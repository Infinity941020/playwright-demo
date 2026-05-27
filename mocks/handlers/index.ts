/*
================================
MSW Handlers Export
================================
*/

import { loginHandlers } from './loginHandlers';
import { userHandlers } from './userHandlers';
import { cartHandlers } from './cartHandlers'; // ← 追加

export const handlers = [
  ...loginHandlers,
  ...userHandlers,
  ...cartHandlers, // ← 追加
];
/*
================================
MSW Handlers Export
================================
*/

import { loginHandlers } from './loginHandlers';
import { userHandlers } from './userHandlers';
import { cartHandlers } from './cartHandlers';

export const handlers = [
  ...loginHandlers,
  ...userHandlers,
  ...cartHandlers,
];
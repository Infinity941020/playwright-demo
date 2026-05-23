/*
================================
MSW Handlers Export
================================
*/

import { loginHandlers } from './loginHandlers';
import { userHandlers } from './userHandlers';

export const handlers = [
  ...loginHandlers,
  ...userHandlers,
];
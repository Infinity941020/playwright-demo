import { setupServer } from 'msw/node';

import { loginHandlers } from './handlers/loginHandlers';
import { userHandlers } from './handlers/userHandlers';

/*
================================
MSW Server
================================
*/

export const server = setupServer(
  ...loginHandlers,
  ...userHandlers
);
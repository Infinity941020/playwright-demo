const { setupServer } = require('msw/node');

const { loginHandlers } = require('./handlers/loginHandlers');
const { userHandlers } = require('./handlers/userHandlers');

/*
================================
MSW Server
================================
*/

exports.server = setupServer(
  ...loginHandlers,
  ...userHandlers
);
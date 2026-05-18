export const apiUsers = {

  validUser: {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  },

  invalidUsers: {

    missingPassword: {
      email: 'eve.holt@reqres.in'
    },

    missingEmail: {
      password: 'cityslicka'
    },

    emptyRequest: {},

    wrongPassword: {
      email: 'eve.holt@reqres.in',
      password: 'wrong-password'
    }
  }
};
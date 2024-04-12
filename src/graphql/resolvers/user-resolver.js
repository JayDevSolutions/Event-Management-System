const allUsersResolver = require('./user/all-users-resolver');
const fetchUserResolver = require('./user/fetch-user-resolver');
const registerResolver = require('./user/register-resolver');
const loginResolver = require('./user/login-resolver');
const changePasswordResolver = require('./user/change-password-resolver');
const resetPasswordResolver = require('./user/reset-password-resolver');
const updatePasswordResolver = require('./user/update-password-resolver');
const logoutResolver = require('./user/logout-resolver');

const userResolver = {
  Query: {
    allUsers: allUsersResolver,

    fetchUser: fetchUserResolver
  },

  Mutation: {
    register: registerResolver,

    login: loginResolver,

    changePassword: changePasswordResolver,

    resetPassword: resetPasswordResolver,

    updatePassword: updatePasswordResolver,

    logout: logoutResolver
  },
};


module.exports = userResolver;
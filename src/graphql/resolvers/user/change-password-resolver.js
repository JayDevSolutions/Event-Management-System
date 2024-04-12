require('dotenv').config();
const messages = require('../../../utils/messages');
const db = require('../../../models');
const User = db.users;
const bcrypt = require('bcrypt');

const changePasswordResolver = async (_, { oldPassword, newPassword }, context) => {
  try {
    if (oldPassword === newPassword) {
      throw new Error("Old password must not be same as new password!!!");
    }

    if (!context.token) {
      throw new Error('You must have a valid token.');
    }

    // Authenticating user 
    const accessToken = context.token;
    const id = accessToken.id;

    const user = await User.findByPk(id);

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid Old Password!!!");
    }

    await user.update({ password: newPassword });

    return { message: messages.changePasswordSuccess, user };
  } catch (error) {
    console.error("Error while changing password of user:", error.message);
    throw new Error("Error in change password. " + error.message);
  }
}

module.exports = changePasswordResolver;
require('dotenv').config();
const messages = require('../../../utils/messages');
const db = require('../../../models');
const User = db.users;
const Token = db.tokens;
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const updatePasswordResolver = async (_, { resetToken, oldPassword, newPassword }) => {
  try {
    if (oldPassword === newPassword) {
      throw new Error("Old password must not be same as new password!!!");
    }

    const decodedToken = jwt.verify(resetToken, secret, { algorithms: ['HS256'] });
    const userId = decodedToken.id;

    const validToken = await Token.findOne({
      where: {
        userId,
        token: resetToken,
        tokenType: 'RESET',
        expiredAt: { [Op.gte]: new Date() }
      }
    });

    if (!validToken) {
      throw new Error('Unauthorized. Used, Invalid or expired access token.');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found with this ID!!!');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid Old Password!!!");
    }

    const result = await Token.findOne({ where: { userId, token: resetToken } });
    if (result) {
      await result.update({ expiredAt: new Date() });
    } else {
      throw new Error('ResetToken missing in database!!!');
    }

    await user.update({ password: newPassword });

    return { message: messages.updatePasswordSuccess, user };
  } catch (error) {
    console.error("Error while updating password of user:", error.message);
    throw new Error("Error in update password. " + error.message);
  }
}

module.exports = updatePasswordResolver;
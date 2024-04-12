require('dotenv').config();
const messages = require('../../../utils/messages');
const db = require('../../../models');
const Token = db.tokens;
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const logoutResolver = async (_, args, { token }) => {
  try {
    if (!token) {
      throw new Error('You must have a valid token.');
    }
    console.log(token)
    const authToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
    const userId = authToken.id;

    const result = await Token.findOne({ where: { userId: userId, token } });
    if (result) {
      await result.update({ expiredAt: new Date() });
    } else {
      throw new Error('ResetToken missing in database!!!');
    }

    return { message: messages.logoutSuccess };
  } catch (error) {
    console.error("Error while logging out of user:", error.message);
    throw new Error("Error in Logout. " + error.message);
  }
}

module.exports = logoutResolver;
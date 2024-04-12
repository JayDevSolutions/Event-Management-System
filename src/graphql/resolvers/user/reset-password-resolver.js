require('dotenv').config();
const messages = require('../../../utils/messages');
const db = require('../../../models');
const User = db.users;
const Token = db.tokens;
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;


const createToken = async (user, secret, expiresIn, tokenType) => {
  try {
    const { id, email, username } = user;
    const token = jwt.sign({ id, email, username }, secret, { algorithm: 'HS256', expiresIn: expiresIn * 1000 });

    // Save the token to the database
    await Token.create({
      userId: id,
      token,
      tokenType: tokenType,
      expiredAt: new Date(new Date().getTime() + expiresIn * 1000),
    });

    return token;
  } catch (error) {
    console.log("Token creation error:", error.message);
    throw new Error("Error while creating a token " + error.message);
  }
};


const resetPasswordResolver = async (_, { email }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found!!!');
    }

    const resetToken = await createToken(user, secret, 300, 'RESET');

    return { message: messages.resetPasswordSuccess, resetToken };
  } catch (error) {
    console.error("Error while changing password of user:", error.message);
    throw new Error("Error in change password. " + error.message);
  }
}

module.exports = resetPasswordResolver;
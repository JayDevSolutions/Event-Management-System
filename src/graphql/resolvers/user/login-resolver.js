require('dotenv').config();
const messages = require('../../../utils/messages');
const db = require('../../../models/index');
const User = db.users;
const Token = db.tokens;
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');

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


const loginResolver = async (_, { email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('No user found with this login credentials.');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid Password');
    }

    const token = await createToken(user, secret, 1800, 'ACCESS');

    return { message: messages.loginSuccess, user, token };
  } catch (error) {
    console.error("Error while login user:", error.message);
    throw new Error("Error logging in user. " + error.message);
  }
}

module.exports = loginResolver;
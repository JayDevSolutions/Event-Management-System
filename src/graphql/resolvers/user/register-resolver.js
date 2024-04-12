const messages = require('../../../utils/messages');
const db = require('../../../models/index');
const User = db.users;

const registerResolver = async (_, { input: { username, firstName, lastName, email, password } }) => {
  try {
    // const userExists = await User.findOne()
    const newUser = {
      firstName,
      lastName,
      username,
      email,
      password
    };
    const user = await User.create(newUser);
    // console.log(user)
    return { message: messages.registrationSuccess, user };
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw new Error("Error registering user. " + error.message);
  }
}

module.exports = registerResolver;
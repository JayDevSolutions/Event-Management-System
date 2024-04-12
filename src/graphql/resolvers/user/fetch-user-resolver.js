const db = require('../../../models');
const User = db.users;

const fetchUserResolver = async (_, { id }) => {
  try {
    const user = await User.findByPk(id);
    // const user = await db.sequelize.query('SELECT * FROM users WHERE id = :userId', {
    //   replacements: { userId: id },
    //   type: db.sequelize.QueryTypes.SELECT
    // });
    return user;
  } catch (error) {
    console.log("Get a user error:", error.message);
    throw new Error("Error while getting A User " + error.message);
  }
}

module.exports = fetchUserResolver;
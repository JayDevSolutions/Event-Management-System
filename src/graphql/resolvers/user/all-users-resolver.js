const db = require('../../../models');
const User = db.users;

const allUsersResolver = async () => {
  try {
    const users = await User.findAll({});
    // const users = await db.sequelize.query('SELECT * FROM users', {
    //   type: db.sequelize.QueryTypes.SELECT
    // });
    return users;
  } catch (error) {
    console.log("Get users error:", error.message);
    throw new Error("Error while getting All Users " + error.message);
  }
}

module.exports = allUsersResolver;
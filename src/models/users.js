const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          message: 'Username must be unique!',
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid email',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await user.generatePasswordHash();
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.password) {
      user.password = await user.generatePasswordHash();
    }
  });

  User.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  User.associate = function (models) {
    User.hasMany(models.events, {
      foreignKey: 'creator',
      sourceKey: 'id',
      as: 'events'
    });

    User.hasMany(models.invites, {
      foreignKey: 'userId',
      sourceKey: 'id',
      as: 'invitations'
    });
  }

  return User;
};



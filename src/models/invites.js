module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define(
    "invites",
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false
      },
      eventId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'events',
          key: 'id'
        },
        allowNull: false
      }
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  Invite.associate = function (models) {
    Invite.belongsTo(models.users, {
      foreignKey: 'userId',
      targetKey: 'id',
      as: 'user'
    });

    Invite.belongsTo(models.events, {
      foreignKey: 'eventId',
      targetKey: 'id',
      as: 'event'
    });
  }

  return Invite;
};

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "events",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      creator: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: true,
      paranoid: true
    }
  );

  Event.associate = function (models) {
    Event.belongsTo(models.users, {
      foreignKey: 'creator',
      targetKey: 'id',
      as: 'user'
    });

    Event.hasMany(models.invites, {
      foreignKey: 'eventId',
      sourceKey: 'id',
      as: 'invitations'
    });
  }

  return Event;
};

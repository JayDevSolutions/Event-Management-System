module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define("tokens", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER
    },
    token: {
      type: DataTypes.STRING
    },
    tokenType: {
      type: DataTypes.STRING,
      enum: ['ACCESS', 'RESET']
    },
    expiredAt: {
      type: DataTypes.DATE
    }
  },
    {
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return Token;
}
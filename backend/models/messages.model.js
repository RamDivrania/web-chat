const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./user.model");

const Messages = sq?.define(
  "Messages",
  {
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

Messages.sync({ alter: true }).then(() => {
  console.log("Messages Model synced");
});

module.exports = Messages;

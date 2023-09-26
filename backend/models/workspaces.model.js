const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const Workspaces = sq?.define("Workspaces", {
  public_channels: {
    type: DataTypes.STRING,
    get: function () {
      return Array.from(JSON.parse(this.getDataValue("public_channels")));
    },
    set: function (val) {
      return this.setDataValue("public_channels", JSON.stringify(val));
    },
  },
  direct_channels: {
    type: DataTypes.STRING,
    get: function () {
      return Array.from(JSON.parse(this.getDataValue("direct_channels")));
    },
    set: function (val) {
      return this.setDataValue("direct_channels", JSON.stringify(val));
    },
  },
  userId: {
    type: DataTypes.INTEGER,
  },
});

Workspaces.sync({ alter: true }).then(() => {
  console.log("Workspaces Model synced");
});

module.exports = Workspaces;

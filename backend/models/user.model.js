const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");
const Messages = require("./messages.model");
const Workspaces = require("./workspaces.model");

const User = sq?.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    fname: {
      type: DataTypes.STRING,
    },
    lname: {
      type: DataTypes.STRING,
    },
    public_channels: {
      type: DataTypes.STRING,
      get: function () {
        console.log("public_channels", this.getDataValue("public_channels"));

        return JSON.parse(this.getDataValue("public_channels"));
      },
      set: function (val) {
        return this.setDataValue("public_channels", JSON.stringify(val));
      },
      defaultValue: [""],
    },
    direct_channels: {
      type: DataTypes.STRING,
      get: function () {
        console.log("direct_channels", this.getDataValue("direct_channels"));
        return JSON.parse(this.getDataValue("direct_channels"));
      },
      set: function (val) {
        return this.setDataValue("direct_channels", JSON.stringify(val));
      },
      defaultValue: [""],
    },
  },
  {
    timestamps: true,
  }
);

User.associate = (models) => {
  User.hasMany(models.Workspaces, {
    foreignKey: "userId", // Use the same name as in the Messages model
  });
};

User.hasMany(Messages, { foreignKey: "id" });
Messages.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Workspaces, { foreignKey: "id" });
Workspaces.belongsTo(User, { foreignKey: "userId", as: "user" });

User.sync({ alter: true }).then(() => {
  console.log("User Model synced");
});

module.exports = User;

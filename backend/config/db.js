const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("chatapp", "postgres", "password", {
  host: "postgres", // as we're running db via docker container , otherwise 'localhost' or '0.0.0.0'
  dialect: "postgres",
});

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
sequelize.options.logging = console.log; // Enable logging to the console

module.exports = { sq: sequelize, testDbConnection };

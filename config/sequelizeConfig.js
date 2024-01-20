const { Sequelize } = require("sequelize");
const config = require("./config"); // Adjust the path as needed

const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
  host: config.database.host,
  dialect: config.database.dialect,
  logging: false,
});

module.exports = sequelize;

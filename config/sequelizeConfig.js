// config/sequelizeConfig.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const config = require("./config"); // Adjust the path as needed

let sequelizeOptions = {
  host: config.database.host,
  dialect: config.database.dialect,
  logging: config.database.logging,
  timezone:"+08:00"
};

// Additional options for production
if (config.database.dialectOptions) {
  sequelizeOptions.dialectOptions = {
    ...config.database.dialectOptions,
    ca: fs.readFileSync(__dirname + "/amazon-rds-ca-cert.pem"),
  };
}

const sequelize = new Sequelize(
  config.database.database, 
  config.database.username, 
  config.database.password, 
  sequelizeOptions
);

module.exports = sequelize;

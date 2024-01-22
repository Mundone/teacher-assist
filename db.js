const { isLocal } = require("./config/config");
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs'); // Import the File System module

let sequelize;

if (isLocal) {
    // Local database configuration
    sequelize = new Sequelize('teacher_journal', 'root', '1113', {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    });
    console.log('Using local database configuration');
} else {
    // AWS RDS configuration
    sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
      host: process.env.HOST,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
          ssl: {
              require: true,
              rejectUnauthorized: false,
              ca: fs.readFileSync(__dirname + '/config/amazon-rds-ca-cert.pem')
          }
      }
    });
    console.log('Using AWS RDS database configuration');
}

module.exports = { sequelize, DataTypes };

// config/config.js
require("dotenv").config();

const isLocal = false; // Adjust the condition as needed

const localConfig = {
  database: {
    username: process.env.LOCAL_DB_USERNAME,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    host: process.env.LOCAL_DB_HOST,
    dialect: "mysql",
    logging: false,
  },
  jwtSecret: process.env.LOCAL_JWT_SECRET,
};

const productionConfig = {
  database: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  jwtSecret: process.env.JWT_SECRET,
};

const config = isLocal ? localConfig : productionConfig;

module.exports = config;

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configure your PostgreSQL connection here
const sequelize = new Sequelize(
  process.env.DB_NAME || 'erpdb',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Set to true to see SQL queries in console
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
  }
};

module.exports = { sequelize, connectDB };

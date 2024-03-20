const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const logger = require('../../logger');
require('dotenv').config();

const model = require('../models/User');
const dbName = "Cloud_db";

const sequelize = new Sequelize({
   dialect: process.env.DB_DIALECT,
   host: process.env.DB_HOST,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
});

const User = model(sequelize);

const createDatabase = async () =>{

      const connection = await mysql.createConnection({
         host: process.env.DB_HOST,
         user: process.env.DB_USERNAME,
         password: process.env.DB_PASSWORD,
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
      logger.info(`Database ${dbName} created successfully.`);
   
}

module.exports = {
   createDatabase,
   sequelize, 
   User 
}
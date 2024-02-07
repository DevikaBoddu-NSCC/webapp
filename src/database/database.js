const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
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
      host: "127.0.0.1",
      user: "root",
      password: "admin@12345",
   });
   await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
}

module.exports = {
   createDatabase,
   sequelize, 
   User 
}
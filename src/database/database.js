const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const model = require('../models/User');
const dbName = "webapp_db_5";

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'admin@12345',
    database: 'webapp_db_5',
});


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
   sequelize }
const mysql = require("mysql2");

const writeDb = mysql.createPool({
  host: process.env.DB_PRIMARY_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const readDb = mysql.createPool({
  host: process.env.DB_REPLICA_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

module.exports = { writeDb, readDb };
const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
});

connection.getConnection(
  err => {
    const mssg = !err ? "------Connected------" : 'connection failed';
    console.log(mssg);
  }
);

module.exports = {
  connection,
}
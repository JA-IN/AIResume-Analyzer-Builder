const mysql = require('mysql2');
require('dotenv').config();

const db  = mysql.createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT || 5432,
    connectTimeout: 10000
  }
);

db.getConnection((err) =>{
  if(err) throw err;

  console.log("Mysql Connected");
});
module.exports = db;
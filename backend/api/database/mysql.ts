const mysql = require("mysql2/promise");

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
});

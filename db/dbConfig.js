const pgp = require("pg-promise")();
require("dotenv").config();

// for local db
const cn = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
};

// for deployment using ElephantSQL comment the cn variable above out and comment the cn variable below in

// const cn = process.env.CONNECTION_STRING;

const db = pgp(cn);


module.exports = db;
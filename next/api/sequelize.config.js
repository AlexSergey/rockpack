const path = require('node:path');

require('dotenv-safe').config({
  allowEmptyValues: true,
  path: process.env.NODE_ENV === 'test' ? path.resolve('./.env.test') : path.resolve('./.env'),
});

module.exports = {
  development: {
    database: process.env.DB_NAME,
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
  },
  production: {
    database: process.env.DB_NAME,
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
  },
  test: {
    database: process.env.DB_NAME,
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
  },
};

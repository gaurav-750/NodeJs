const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node_shop", "root", "pass123", {
  host: "localhost",
  dialect: "mysql",
});
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
// });

module.exports = sequelize;

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { config } = require("./config.js");

module.exports = {
  development: {
    client: "mysql",
    connection: {
      socketPath: config.mysql_socket,
      host: config.mysql_host,
      port: 3306,
      user: config.mysql_user,
      password: config.mysql_password,
      database: config.mysql_db,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

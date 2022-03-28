const bf = require('../bot_function.js')
const sqlite3 = require("sqlite3");

new sqlite3.Database(
  "./test.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
);

(async () => {
  const db = require("knex")({
    client: "sqlite3",
    connection: {
      filename: "./test.db",
    },
  });

  // crate trades table
  await db.schema.hasTable("trades").then(async function (exists) {
    if (!exists) {
      await db.schema.createTable("trades", (table) => {
        table.increments("id");
        table.string("time");
        table.string("type");
        table.float("qty");
        table.float("price");
        table.text("cause");
      });
    }
  });



  console.log('- menginput test data')

  await db('trades').insert({
    time: 'test',
    type: 'sell',
    qty: 1,
    price: 1000000,
    cause: 'trigger'
  })



  console.log('- mengambil hasil test data')

  db.from('trades').select("*")
    .then((rows) => {
        for (row of rows) {
            console.log(`${row['id']} ${row['type']} ${row['price']}`);
        }
    })
})()

const bf = require('../bot_function.js');

(async () => {
  const db = await bf.initdb()

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

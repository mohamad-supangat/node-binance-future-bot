const { redisDb } = require("../redis.js");
const bf = require('../bot_function.js');

(async function() {
  console.log(await bf.get_market_price())
  console.log(await redisDb.set('redisDb', {
    side: 'sell'
  }))


  console.log(await redisDb.get('redisDb'))


  console.log(await redisDb.set('redisDb', {
    side: 'buy'
  }))

  console.log(await redisDb.get('redisDb'))

  console.log(await redisDb.set('redisDb', {
    qty: 100
  }))

  console.log(await redisDb.get('redisDb'))

  console.log(await redisDb.set('redisDb', {
    side: 'sell'
  }))

  console.log(await redisDb.get('redisDb'))

  await redisDb.set("marketPrice", {
    marketPrice: '10000'
  });
}());

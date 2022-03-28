/**
 * Untuk mendapatkan harga market dan menyimpan di penyimpanan redis secara realtime
 *
 */

const { redisDb } = require("../redis.js");
const bf = require("../bot_function.js");
const { config } = require("../config.js");
const binance = bf.binance();
// store market price
async function store_market_price(data) {
  console.log(data);
  const price = data.close;
  await redisDb.set("market", {
    price: Number.parseFloat(price)
  });

  console.log("current price is", price);
  await bf.check_fill_and_close(price);
}

console.log("capture websocket");
// binance.futuresMarkPriceStream(config.market, store_mark_price);
binance.futuresMiniTickerStream(config.symbol, store_market_price);

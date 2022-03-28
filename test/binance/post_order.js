const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  await bf.init_binance();

  const type = "sell";
  const price = 401;

  const spread_price = bf.generate_open_order_spread_price(type, price);
  console.log("Spread Price", spread_price);

  const qty = await bf.generate_qty_order(spread_price);
  console.log("Qty to order", qty);

  const target_price = bf.generate_target_price(type, qty, spread_price);
  console.log("Target price: ", target_price);

  await bf.submit_order(type, qty, price, target_price);
})();

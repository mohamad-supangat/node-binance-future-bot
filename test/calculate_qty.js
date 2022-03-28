const bf = require("../bot_function.js");
const { config } = require("../config.js");
const binance = bf.binance();

(async () => {
  const type = "buy";
  const price = 100;

  console.log("harga sekarang", price);
  const spread_price = bf.generate_open_order_spread_price(type, price);
  console.log("Spread Price", spread_price);

  const qty = await bf.generate_qty_order(spread_price);
  console.log("Qty to order", qty);
  console.log("leverage", config.leverage);
  console.log("balance", (config.balance * config.percent_order) / 100);
  console.log("target profit", config.target_profit);

  const target_price = bf.generate_target_price(type, qty, spread_price);
  console.log("Target price: ", target_price);
})();

const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  const type = "sell";
  const price = 395;
  const qty = 1;

  const target_price = bf.submit_take_profit(type, qty, price);
  console.log("Target price: ", target_price);
})();

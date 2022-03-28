const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  const type = "sell";
  const price = 408;
  const qty = 1;

  bf.submit_order(type, qty, price);
  // console.log("Target price: ", target_price);
})();

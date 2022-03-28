
const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  // console.log(await binance.futuresAccount());
  console.info( await bf.get_take_profit_order() );
})();


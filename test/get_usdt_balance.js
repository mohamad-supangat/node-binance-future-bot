const bf = require("../bot_function.js");
const {config} = require('../config.js')
const binance = bf.binance();

(async () => {
  console.log(await bf.get_base_asset_balance())
})();

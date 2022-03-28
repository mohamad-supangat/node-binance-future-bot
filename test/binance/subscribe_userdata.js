const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  // console.log(await bf.get_base_asset_balance())
  // console.info(await binance.futuresGetDataStream());
  function haha(data) {
    console.log(data);
  }

  binance.websockets.userFutureData(haha, subscribed_callback = haha);
})();

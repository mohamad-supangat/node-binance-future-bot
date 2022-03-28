const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  console.info( await bf.getFundingRateValid() );
})();


const bb = require("trading-indicator").bb;
(async () => {
  let bbData = await bb(50, 2, "close", "binance", "BTC/USDT", "15m", true);
  console.log(bbData[bbData.length - 2]);
})();

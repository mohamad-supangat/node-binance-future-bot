const altert = require("trading-indicator").macd;
(async () => {
  console.log(
    await macd(12, 26, 9, "close", "binance", "BTC/USDT", "15m", true),
  );
})();

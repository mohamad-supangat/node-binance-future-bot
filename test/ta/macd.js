const macd = require("trading-indicator").macd;
(async () => {
  const macdData = await macd(
    12,
    26,
    9,
    "close",
    "binance",
    "BTC/USDT",
    "15m",
    true
  );
  const { MACD: previous_macd, signal: previous_signal } =
    macdData[macdData.length - 2];
  const { MACD: current_macd, signal: current_signal } =
    macdData[macdData.length - 1];

  let is_hot = false,
    is_cold = false;

  // dapatkan sinyal hot dan cold
  is_hot = previous_macd < previous_signal && current_macd > current_signal;
  is_cold = previous_macd > previous_signal && current_macd < current_signal;

  console.log({
    signal: {
      previous_macd,
      previous_signal,
      current_macd,
      current_signal,
    },
    status: {
      is_hot,
      is_cold
    }
  });
})();

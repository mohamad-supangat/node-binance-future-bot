const {
  EXCHANGES_ENUM,
  INTERVALS_ENUM,
  SCREENERS_ENUM,
  TradingViewScan,
} = require("./tradingview-ta/index.js");

const { config } = require("./../config.js");

exports.get_signal = async function (type = 'summary', period = config.candle_period) {
  try {
    const result = await new TradingViewScan(
      SCREENERS_ENUM["crypto"],
      EXCHANGES_ENUM["BINANCE"],
      config.tradingview_symbol,
      INTERVALS_ENUM[period]
      // You can pass axios instance. It's optional argument (you can use it for pass custom headers or proxy)
    ).analyze();


    // console.log({
    //   period,
    //   result
    // });

    let signal = result[type]["RECOMMENDATION"];
    signal = signal.toLowerCase();

    // check if 'strong sell' signal
    if (signal.includes("sell")) {
      signal = "sell";
    } else if (signal.includes("buy")) {
      signal = "buy";
    } else {
      signal = "neutral";
    }


    return signal;
  } catch (e) {
    console.log("Trading view has eror", e);
    return this.get_signal();
  }
};

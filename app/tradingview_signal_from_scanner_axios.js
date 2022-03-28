/**
 * dapatkan signal dan submit order dari tradingview scanner
 *
 */
const axios = require("axios");
const bf = require("../bot_function.js");
const { config } = require("../config.js");

// some tmp var
let last_signal;

const get = async (options) => {
  const {
    ticker = "BINANCE:" + config.tradingview_symbol,
    resolution = 1,
    scanner = "crypto",
    indicator = "Recommend.All",
  } = options;

  const body = {
    symbols: { tickers: [ticker], query: { types: [] } },
    columns: [`${indicator}|${resolution}`],
  };

  const {
    data: { data },
  } = await axios.post(`https://scanner.tradingview.com/${scanner}/scan`, body);

  const signal = data[0].d[0];
  return { ...options, signal };
};

async function execute1() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

    const data = await get({
      resolution: 1,
      ticker: "BINANCE:" + config.tradingview_symbol,
    });

    let signal = data.signal;

    console.log("current signal", signal);
    // jika signal menandakan strong buy or strong sell
    if (signal <= -0.5 || signal >= 0.5) {
      signal = signal < 0 ? "sell" : "buy";
      if (!last_signal) {
        last_signal = signal;
      } else {
        if (last_signal != signal) {
          const price = await bf.get_market_price();
          console.log(`signal ${signal}, price: ${price}`);

          bf.trigger_webhook({
            type: signal,
            price: price,
          });
        }
      }
    }
  }
}

execute1();

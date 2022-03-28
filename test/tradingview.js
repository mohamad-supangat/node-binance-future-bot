const axios = require("axios");

const get = async (options) => {
  const {
    ticker = "COINBASE:BTCGBP",
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

  console.log("received data", data);

  const signal = data[0].d[0];
  return { ...options, signal };
};

(async () => {
  const signal = await get({
    resolution: 1,
    ticker: "BINANCE:BTCUSDTPERP",
  });
  console.log("signal", signal);
})();

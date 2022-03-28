const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  await bf.init_binance();

  // console.info( await binance.futuresMarkPrice() );

  const exchange = await binance.futuresExchangeInfo();
  const {symbols} = exchange;

  const target_symbol = 'XMRUSDT';
  const symbol = symbols.find((x) => x.symbol == target_symbol);
  console.info(symbol);
})();


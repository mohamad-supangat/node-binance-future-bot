const default_config = {
  test: true, // check untuk testnet
  paper: false, // check untuk menjalankan paper mode / tidak create order live
  market: "BNB/USDT", // target market
  symbol: "BNBUSDT",
  tradingview_symbol: "BNBUSDTPERP",
  order_type: 'LIMIT', // LIMIT OR MARKET
  leverage: "25", // leverage
  margin_type: "ISOLATED", //  Adjust Margin Type (ISOLATED, CROSSED)
  percent_order: 100, //  berapa persen saldo untuk place order
  balance: 9, // saldo yang digunkaan untuk bot
  spread: 0.009, // diguanakan untuk menghitung target price

  base_asset: "USDT",
  trading_fee: 0.02,
  target_profit: 123,
  close_all_position_if_signal_change: false,

  //signal
  indicator: "macd_cross",
  candle_period: "5m",
  tradingview_api_timeframe: '15',

  // infinity loop in second
  trading_view_loop_sleep_time: 5 * 60,

  // database
  // mysql_socket: "/run/mysqld/mysqld.sock",
  mysql: false,
  mysql_host: "127.0.0.1",
  mysql_user: "root",
  mysql_password: "docker",
  mysql_db: "trades",

  // pengaturan api key
  test_APIKEY: null,
  test_APISECRET: null,

  // live api key
  APIKEY: null,
  APISECRET: null,

  // pengaturan telegram
  telegram: false,
  telegram_bot_token: null,
  telegram_chat_id: null,
};

// get custom config
const fs = require("fs");
let custom_config = {};
try {
  if (fs.existsSync("./config.json")) {
    custom_config = require("./config.json");
  }
} catch (err) {
  console.error(err);
}

exports.config = {
  ...default_config,
  ...custom_config,
};

exports.market_precision = function (symbol) {
  let price = -99;
  let qty = -99;

  if (symbol == "BTCUSDT") {
    price = 2;
    qty = 3;
  } else if (symbol == "ETHUSDT") {
    price = 2;
    qty = 3;
  } else if (symbol == "LTCUSDT") {
    price = 2;
    qty = 3;
  } else if (symbol == "SOLUSDT") {
    price = 3;
    qty = 0;
  } else if (symbol == "BNBUSDT") {
    price = 2;
    qty = 2;
  } else if (symbol == "ADAUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "DOGEUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "MATICUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "BAKEUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "1000SHIBUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "XRPUSDT") {
    price = 4;
    qty = 1;
  } else if (symbol == "SUSHIUSDT") {
    price = 3;
    qty = 0;
  } else if (symbol == "DOTUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "ALPHAUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "DGBUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "RLCUSDT") {
    price = 4;
    qty = 1;
  } else if (symbol == "HNTUSDT") {
    price = 3;
    qty = 0;
  } else if (symbol == "OCEANUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "ZRXUSDT") {
    price = 4;
    qty = 1;
  } else if (symbol == "ONTUSDT") {
    price = 4;
    qty = 1;
  } else if (symbol == "FLMUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "BCHUSDT") {
    price = 2;
    qty = 3;
  } else if (symbol == "BTSUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "RSRUSDT") {
    price = 6;
    qty = 0;
  } else if (symbol == "BZRXUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "SFPUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "ZILUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "EOSUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "ENJUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "TRXUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "LITUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "RENUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "COTIUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "STORJUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "LRCUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "UNFIUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "BALUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "YFIIUSDT") {
    price = 1;
    qty = 3;
  } else if (symbol == "UNIUSDT") {
    price = 3;
    qty = 0;
  } else if (symbol == "TLMUSDT") {
    price = 4;
    qty = 0;
  } else if (symbol == "GTCUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "TRBUSDT") {
    price = 2;
    qty = 1;
  } else if (symbol == "ALICEUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "ONEUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "RVNUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "AXSUSDT") {
    price = 2;
    qty = 0;
  } else if (symbol == "XEMUSDT") {
    price = 4;
    qty = 1;
  } else if (symbol == "VETUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "LINAUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "XLMUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "QTUMUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "SOLUSDT") {
    price = 3;
    qty = 0;
  } else if (symbol == "DENTUSDT") {
    price = 6;
    qty = 0;
  } else if (symbol == "IOTXUSDT") {
    price = 5;
    qty = 0;
  } else if (symbol == "DEFIUSDT") {
    price = 3;
    qty = 1;
  } else if (symbol == "XMRUSDT") {
    price = 2;
    qty = 3;
  }
  return {
    qty: qty,
    price: price,
  };
};

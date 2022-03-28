const Binance = require("node-binance-api");
const TelegramBot = require("node-telegram-bot-api");
const moment = require("moment-timezone");

const { config } = require("./config");
const { market_precision } = require("./data/market.js");
const db = require("./db.js");
const { redisDb } = require("./redis.js");

// client init untuk binance
exports.binance = function () {
  const binance = new Binance().options({
    test: config.test,
    APIKEY: config.test ? config.test_APIKEY : config.APIKEY,
    APISECRET: config.test ? config.test_APISECRET : config.APISECRET,
  });

  return binance;
};

// binance init leverage and margin type
exports.init_binance = async function () {
  const binance = await this.binance();
  try {
    await binance.futuresLeverage(config.symbol, config.leverage);
    await binance.futuresMarginType(config.symbol, config.margin_type);
  } catch {
    this.init_binance();
  }
};

// get current time with timezone
exports.current_time = function () {
  return moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
};

// mengambil open posisi terakhir di table trades
exports.get_last_position = async function () {
  const item = await db.table("trades").orderBy("id", "desc").first();
  return item;
};

// fungsi untuk send log ke console dan notifikasi ke telegram
// !! unimplemented telegram
exports.send_log = async function (message, res = false) {
  console.log(message);

  if (config.telegram && config.telegram_bot_token && config.telegram_chat_id) {
    this.send_telegram_message(message);
  }
  if (res) {
    return res.send(message);
  }

  return true;
};

// get latest market_price from redis data
exports.get_market_price = async function () {
  const { price = 0 } = await redisDb.get("market", "price");
  return Number.parseFloat(price);
};

// hitung qty untuk order berdasarkan persentase order dan balance di config
exports.generate_qty_order = async function (price) {
  if (config.balance && config.balance > 0) {
    const balance = (config.balance * config.percent_order) / 100;
    const market_price = !price ? await this.get_market_price() : price;

    let qty = (parseFloat(balance) / market_price) * config.leverage;
    // qty = qty * 0.99;
    qty = this.round_to_precision("qty", qty);
    return qty;
  }
  return 0;
};

// dapatkan target harga open sisi berdasarkan spread dari config

exports.generate_open_order_spread_price = function (type, market_price) {
  const discount = (market_price * config.spread) / 100;

  let target_price =
    type == "buy" ? market_price - discount : market_price + discount;
  target_price = this.round_to_precision("price", target_price);

  return target_price;
};

// hitung target harga untuk profit yang diinginkan
exports.generate_target_price = function (type, qty, price) {
  const target_profit = config.target_profit;
  let target_price;
  if (type == "buy") {
    target_price =
      Number.parseFloat(price) +
      Number.parseFloat(target_profit) / Number.parseFloat(qty);
  } else {
    target_price =
      Number.parseFloat(price) -
      Number.parseFloat(target_profit) / Number.parseFloat(qty);
  }

  return this.round_to_precision("price", target_price);
};

// rounding precision
exports.round_to_precision = function (type, value) {
  const precision = market_precision(config.symbol);
  return Number.parseFloat(value).toFixed(
    type == "qty" ? precision.qty : precision.price
  );
};

//  membuat order
exports.create_order = async function (type, qty, cause, { cross = false }) {
  // hitung semua data market price
  const market_price = Number.parseFloat(await this.get_market_price());
  const discount = (market_price * config.spread) / 100;

  let target_price =
    type == "long" ? market_price - discount : market_price + discount;
  target_price = this.round_to_precision("price", target_price);

  // hitung target qty
  let target_qty = qty;
  if (cross) {
    target_qty = target_qty * 2;
  }
  target_qty = this.round_to_precision("qty", target_qty);

  if (!config.paper) {
    if (type == "long") {
      await binance.futuresBuy(config.symbol, target_qty, target_price);
    } else {
      await binance.futuresSell(config.symbol, target_qty, target_price);
    }
  }

  // this.save_order(type, qty, cause, target_price);

  const text = `${type} ${config.symbol} x${config.leverage} qty: ${qty} price : ${target_price}`;
  this.send_log(text);
  this.send_telegram_message(text);
};

// trigger from webhook
exports.trigger_webhook = async function ({ type, price }) {
  price = this.generate_open_order_spread_price(type, price);
  const qty = await this.generate_qty_order(price);

  await this.submit_order(type, qty, price);

  const cause = `${config.indicator} ${config.candle_period} ${type}`;
  const target_price = this.generate_target_price(type, qty, price);

  await this.send_log(`Webhook Trigger ${qty} ${cause} ${price}`);

  // console.log(target_price, price, qty);
  await this.save_order({
    market: config.symbol,
    period: config.candle_period,
    indicator: config.indicator,
    type: type,
    qty: qty,
    price: Number.parseFloat(price),
    target_price: Number.parseFloat(target_price),
    cause: cause,
  });

  return true;
};

// submit order
exports.submit_order = async function (type, qty, price) {
  try {
    const binance = this.binance();
    const side = type == "buy" ? "BUY" : "SELL";
    if (config.order_type == "LIMIT") {
      console.info(
        "future limit order",
        await binance.futuresOrder(side, config.symbol, qty, price, {
          type: "LIMIT",
        })
      );

      await redisDb.set("lastOrder", {
        status: "order",
        side: type,
      });
    } else if (config.order_type == "MARKET") {
      console.info(
        "future market order",
        await binance.futuresOrder(side, config.symbol, qty, false, {
          type: "MARKET",
        })
      );

      await redisDb.set("lastOrder", {
        status: "position",
        side: type,
      });
    }

    this.send_log(`Submit order ${type} ${qty} ${price}`);
    return true;
  } catch (e) {
    console.log(e);
    // this.submit_order(type, qty, price);
  }
};

exports.get_postion = async function () {
  const binance = this.binance();
  try {
    let position_data = await binance.futuresPositionRisk(),
      markets = Object.keys(position_data);
    for (let market of markets) {
      let obj = position_data[market],
        size = Number(obj.positionAmt);
      if (size == 0 || obj.symbol != config.symbol) continue;
      return obj;
    }

    return null;
  } catch {
    return await this.get_postion();
  }
};
// close semua posisi yang sedang aktiv
exports.close_all_position = async function () {
  const binance = this.binance();

  let position_data = await binance.futuresPositionRisk(),
    markets = Object.keys(position_data);
  for (let market of markets) {
    let obj = position_data[market],
      qty = Number(obj.positionAmt);
    if (qty == 0) continue;

    // console.log(market);

    const type = qty > 0 ? "sell" : "buy";
    qty = Math.abs(qty);
    const current_price = await this.get_market_price();

    console.info(
      `close position, ${obj.leverage}x\t${obj.symbol}\t${obj.unRealizedProfit}`
    );
    this.submit_order(type, qty, current_price);
  }
};
// submit take profit order berdasarkan type qty dan target_price
exports.submit_take_profit = async function (type, qty, target_price) {
  try {
    const binance = this.binance();
    const side = type == "sell" ? "BUY" : "SELL";
    await binance.futuresOrder(side, config.symbol, qty, target_price, {
      type: "TAKE_PROFIT",
      stopPrice: target_price,
      // price: target_price,
    });

    this.send_log(`Submit Take Profit ${type} ${qty} ${target_price}`);
    await redisDb.set("lastOrder", {
      takeProfit: true,
    });
  } catch (e) {
    console.log(e);
    this.submit_take_profit(type, qty, target_price);
  }
};

// menyimpan data order kedalam database
exports.save_order = async function ({
  market,
  period,
  indicator,
  time,
  type,
  last_status,
  qty,
  price,
  target_price,
  cause,
}) {
  if (config.mysql == true) {
    db("trades")
      .insert({
        market: market,
        period: period,
        indicator: indicator,
        time: this.current_time(),
        type: type,
        last_status: last_status,
        qty: qty,
        price: Number.parseFloat(price),
        target_price: Number.parseFloat(target_price),
        cause: cause,
      })
      .then((x) => {
        console.log(x);
      })
      .catch((x) => {
        console.log(x);
      });
  }
};

exports.check_fill_and_close = async function (price) {
  if (!config.mysql) {
    return false;
  }
  // open buy, harga kurang dari opensisi
  console.log(
    await db("trades")
      .where("type", "buy")
      .where("fill_at", null)
      .where("price", ">=", price)
      .update({
        fill_at: this.current_time(),
      })
  );

  // close buy, harga lebih dari open posisi
  console.log(
    await db("trades")
      .where("type", "buy")
      .where("close_at", null)
      .where("target_price", "<=", price)
      .update({
        close_at: this.current_time(),
      })
  );

  // open sell, harga lebih dari opensisi
  console.log(
    await db("trades")
      .where("type", "sell")
      .where("fill_at", null)
      .where("price", "<=", price)
      .update({
        fill_at: this.current_time(),
      })
  );

  // close buy, harga kurang dari open posisi
  console.log(
    await db("trades")
      .where("type", "sell")
      .where("close_at", null)
      .where("target_price", ">=", price)
      .update({
        close_at: this.current_time(),
      })
  );
};
// send telegram notification
exports.send_telegram_message = function (message) {
  try {
    const bot = new TelegramBot(config.telegram_bot_token);
    bot.sendMessage(config.telegram_chat_id, message);
  } catch (e) {
    console.log("error send Telegram", e);
  }
};

// get balance yang tersedia berdasarkan base_asset di config
exports.get_base_asset_balance = async function () {
  const binance = this.binance();
  try {
    let balance;
    const balances = await binance.futuresBalance();
    for (const i of balances) {
      if (i.asset == config.base_asset) {
        balance = i.balance;
        break;
      }
    }
    return balance;
  } catch {
    return this.get_base_asset_balance();
  }
};

// dapatkan open order yang tersedia
exports.get_open_orders = async function () {
  const binance = this.binance();
  try {
    return await binance.futuresOpenOrders(config.symbol);
  } catch {
    return this.get_open_orders();
  }
};

exports.get_take_profit_order = async function () {
  try {
    const orders = await this.get_open_orders();
    let takeProfitOrder;

    for (let order of orders) {
      const orderType = order.type;

      if (config.symbol == order.symbol && orderType.includes("TAKE_PROFIT")) {
        takeProfitOrder = order;
        break;
      }
    }

    return takeProfitOrder;
  } catch {
    return await exports.get_take_profit_order();
  }
};
exports.cancel_all_order = async function () {
  const binance = this.binance();
  console.info(await binance.futuresCancelAll(config.symbol));
};

exports.getFundingRateValid = async function () {
  const binance = this.binance();
  const markPrice = await binance.futuresMarkPrice(config.symbol);

  const nextFundingTime = moment
    .unix(markPrice.nextFundingTime / 1000);

  const diff = nextFundingTime.diff(moment(), 'minutes');

  console.log({
    nextFundingTime: nextFundingTime.format("YYYY-MM-DD HH:mm:ss"),
  });

  return diff >= 60;
};

/**
 * Pengecekan indicator macd dengan module pakcage trading-indicator
 * git@github.com:mohamad-supangat/trading-indicator.git
 */

const { macd } = require("trading-indicator");
const bf = require("./../bot_function.js");
const { config } = require("./../config.js");
const tradingview_ta = require("../lib/tradingview_ta");
const { redisDb, initRedis } = require("../redis.js");

const sleep_time = Number.parseFloat(config.trading_view_loop_sleep_time) *
  1000; // in milisecond

// init redis db default data
initRedis();

// console.log(indicator);
async function get_signal() {
  try {
    let macdData = await macd(
      12,
      26,
      9,
      "close",
      "binance",
      config.market,
      config.candle_period,
      true,
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

    return {
      is_hot,
      is_cold,
    };
  } catch (e) {
    console.log("error pada halaman inquiry", e);
    return await get_signal();
  }
}

async function execute_bot() {
  const signal = await get_signal();
  const ta_signal = await tradingview_ta.get_signal();

  bf.send_log(
    JSON.stringify({
      signal,
      ta_signal,
    }),
  );

  // jika order sama dengan sebelumnya maka jangan paksa order
  const lastOrder = (await redisDb.get("lastOrder")) ?? {};

  let post_order = "none";
  // trigger order buy
  if (signal.is_hot && ta_signal == "buy" && lastOrder.side != "buy") {
    post_order = "buy";
  }

  // trigger order sell
  if (signal.is_cold && ta_signal == "sell" && lastOrder.side != "sell") {
    post_order = "sell";
  }

  if (post_order != "none") {
    console.log("Persiapan pasang order");
    // check dulu apakah masih ada order yang masih menggantung
    if (lastOrder.status == "position") {
      // jika masih ada posisi yang terbuka dan berlawanan maka close dahulu
      if (config.close_all_position_if_signal_change) {
        await bf.close_all_position();
      } else {
        // jika tidak maka jangan lakukan apapun dan berikan sinyal false
        return false;
      }
    }

    const price = await bf.get_market_price();
    bf.trigger_webhook({
      type: post_order,
      price: price,
    });
  }
}

// start infinity loop
async function execute_loop() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, sleep_time));
    execute_bot();
  }
}

execute_loop();

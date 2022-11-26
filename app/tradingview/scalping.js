/**
 * Pengecekan indicator scalping pullback
 * @mathieuc/tradingview
 */

const TradingView = require("@mathieuc/tradingview");
const bf = require("./../../bot_function.js");
const { config } = require("./../../config.js");
const { redisDb, initRedis } = require("../../redis.js");

// client tradingview
initRedis();
let last_signal;

const client = new TradingView.Client();
const chart = new client.Session.Chart();

chart.setMarket("BINANCE:" + config.tradingview_symbol, {
  timeframe: config.tradingview_api_timeframe,
  range: 5, // Can be positive to get before or negative to get after
  // to: 1600000000,
});

TradingView.getIndicator("PUB;XnU5RtE4HZzxp4s1anV1LICs5CNFGPqj").then(
  async (indic) => {
    console.log(`Loading '${indic.description}' study...`);
    const STD = new chart.Study(indic);

    STD.onUpdate(async () => {
      const data = STD.periods;
      console.log(data);

      // const last_candle = true;
      // let previous_macd, previous_signal, current_macd, current_signal;
      // if (last_candle) {
      //   previous_macd = macdData[1].MACD;
      //   previous_signal = macdData[1].Signal;
      //
      //   current_macd = macdData[0].MACD;
      //   current_signal = macdData[0].Signal;
      // } else {
      //   previous_macd = macdData[2].MACD;
      //   previous_signal = macdData[2].Signal;
      //
      //   current_macd = macdData[1].MACD;
      //   current_signal = macdData[1].Signal;
      // }
      //
      // let is_hot = false,
      //   is_cold = false;
      //
      // is_hot = previous_macd < previous_signal && current_macd > current_signal;
      // is_cold = previous_macd > previous_signal && current_macd < current_signal;
      //
      // console.log({ is_hot, is_cold });
      //
      // // prepare order
      // let lastOrder = await redisDb.get("lastOrder");
      // // lastOrder = lastOrder ? lastOrder : null;
      // console.log("last order data", lastOrder);
      //
      // let post_order = "none";
      // if (is_hot && lastOrder.side != "buy") {
      //   post_order = "buy";
      // }
      // // trigger order sell
      // if (is_cold && lastOrder.side != "sell") {
      //   post_order = "sell";
      // }
      //
      // // ketika signal terakhir sama dengan signal sekarang maka lewati
      // if (post_order == last_signal) {
      //   post_order = "none";
      // }
      //
      // // check jika menggunakan fitur ta signal
      // let checkTaSignal = true;
      // if (checkTaSignal && post_order != "none") {
      //   const ta_signal = await tradingview_ta.get_signal("oscillators");
      //   console.log("Ta Signal data", ta_signal);
      //   if (post_order != ta_signal) {
      //     post_order = "none";
      //   }
      // }
      //
      // let checkFundingRate = true;
      // if (checkFundingRate && post_order != "none") {
      //   const next = await bf.getFundingRateValid();
      //   if (next == false) {
      //     post_order = "none";
      //   }
      // }
      //
      // if (post_order != "none") {
      //   if (lastOrder.status == "position") {
      //     // jika masih ada posisi yang terbuka dan berlawanan maka close dahulu
      //     const close_open_position = config.close_all_position_if_signal_change;
      //     if (close_open_position) {
      //       await bf.close_all_position();
      //     } else {
      //       // jika tidak maka jangan lakukan apapun dan berikan sinyal false
      //       post_order = "none";
      //     }
      //   }
      // }
      //
      // if (post_order != "none") {
      //   console.log("mendapatkan signal untuk post order", {
      //     last_signal,
      //     post_order,
      //     is_hot,
      //     is_cold,
      //   });
      //
      //   const price = chart.periods[0].close;
      //   await bf.trigger_webhook({
      //     type: post_order,
      //     price: price,
      //   });
      //
      //   last_signal = post_order;
      // }

      //     console.log({
      //       current_macd,
      //       current_signal,
      //       previous_macd,
      //       previous_signal,
      //     });
      // client.end();
    });
  }
);

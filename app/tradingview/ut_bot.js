/**
 * Pengecekan indicator UT SIGNAL menggunakan lib tradingview api
 * @mathieuc/tradingview
 */

const TradingView = require("@mathieuc/tradingview");
const bf = require("./../../bot_function.js");
const { config } = require("./../../config.js");
const { redisDb, initRedis } = require("../../redis.js");
const tradingview_ta = require("../../lib/tradingview_ta");

// client tradingview
initRedis();
let last_signal;

const client = new TradingView.Client();
const chart = new client.Session.Chart();

chart.setMarket("BINANCE:" + config.tradingview_symbol, {
  timeframe: config.tradingview_api_timeframe,
  range: 3, // Can be positive to get before or negative to get after
  // to: 1600000000,
});

TradingView.getIndicator("PUB;ra5bW3NfCYBvMNBUfDZ94xAyTn6f3Ae6").then(
  async (indic) => {
    console.log(`Loading '${indic.description}' study...`);
    const STD = new chart.Study(indic);

    STD.onUpdate(async () => {
      const macdData = STD.periods;

      const last_candle = true;
      let buy, sell;
      if (last_candle) {
        buy = macdData[0].Buy;
        sell = macdData[0].Sell;
      } else {
        buy = macdData[1].Buy;
        sell = macdData[1].Sell;
      }

      let is_hot = false,
        is_cold = false;

      is_hot = buy == 1;
      is_cold = sell == 1;

      console.log({ is_hot, is_cold });

      // prepare order
      let lastOrder = await redisDb.get("lastOrder");
      // lastOrder = lastOrder ? lastOrder : null;
      console.log("last order data", lastOrder);

      let post_order = "none";
      if (is_hot && lastOrder.side != "buy") {
        post_order = "buy";
      }
      // trigger order sell
      if (is_cold && lastOrder.side != "sell") {
        post_order = "sell";
      }

      // ketika signal terakhir sama dengan signal sekarang maka lewati
      if (post_order == last_signal) {
        post_order = "none";
      }

      // check jika menggunakan fitur ta signal
      let checkTaSignal = false;
      if (checkTaSignal && post_order != "none") {
        const ta_signal = await tradingview_ta.get_signal("oscillators");
        console.log("Ta Signal data", ta_signal);
        if (post_order != ta_signal) {
          post_order = "none";
        }
      }

      let checkFundingRate = true;
      if (checkFundingRate && post_order != "none") {
        const next = await bf.getFundingRateValid();
        if (next == false) {
          post_order = "none";
        }
      }

      if (post_order != "none") {
        if (lastOrder.status == "position") {
          // jika masih ada posisi yang terbuka dan berlawanan maka close dahulu
          const close_open_position =
            config.close_all_position_if_signal_change;
          if (close_open_position) {
            await bf.close_all_position();
          } else {
            // jika tidak maka jangan lakukan apapun dan berikan sinyal false
            post_order = "none";
          }
        }
      }

      if (post_order != "none") {
        console.log("mendapatkan signal untuk post order", {
          last_signal,
          post_order,
          is_hot,
          is_cold,
        });

        const price = chart.periods[0].close;
        await bf.trigger_webhook({
          type: post_order,
          price: price,
        });

        last_signal = post_order;
      }

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

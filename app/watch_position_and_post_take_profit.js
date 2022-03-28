/**
 * Buat take profit otomatis
 */

const bf = require("../bot_function.js");
const { config } = require("../config.js");
const { redisDb } = require("../redis.js");
const binance = bf.binance();

(async () => {
  async function callback(data) {
    console.log(data);
    if (
      data.eventType == "ACCOUNT_UPDATE" &&
      data.updateData.eventReasonType == "ORDER"
    ) {
      const positions = data.updateData.positions;
      console.log(positions);

      // check jika hanya posisi yang terbuka hanya 1,
      if (positions.length == 1) {
        const position = positions[0];
        let qty = Number.parseFloat(position.positionAmount);

        // qty harus jangan 0 untuk memvalidasi open order
        if (qty == 0) {
          await redisDb.set("lastOrder", {
            status: false,
            takeProfit: false,
            side: false,
          });

          bf.send_log("Order Selesai");
        } else {
          // jika sudah mempunyai take profit order maka lewati
          const { takeProfit: takeProfitStatus } = await redisDb.get(
            "lastOrder",
            "takeProfit",
          );

          if (takeProfitStatus == true) {
            return false;
          }

          const type = qty < 0 ? "sell" : "buy";
          qty = Math.abs(qty);
          const entry_price = Number.parseFloat(position.entryPrice);
          const target_profit_price = bf.generate_target_price(
            type,
            qty,
            entry_price,
          );

          console.log("order filled", type, qty, entry_price);

          await redisDb.set("lastOrder", {
            status: "position",
          });


          // cancel semua order terlebih dahulu
          await bf.cancel_all_order();
          await bf.submit_take_profit(type, qty, target_profit_price);
        }
      }
    }
  }

  binance.websockets.userFutureData(null, subscribed_callback = callback);
})();

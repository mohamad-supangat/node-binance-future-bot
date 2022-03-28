/**
 * fungsi untuk mengecek open posisi setiap 5 detik
 * dan buatkan take profit otomatis sesuai dengan yang terdapat di konfig
 *
 */


const bf = require("./../bot_function.js");
const { config } = require("./../config.js");
const { redisDb, initRedis } = require("../redis.js");
// initRedis();

const sleep_time = 5 * 1000; // in milisecond
let has_position;

async function execute_bot() {
  const activePosition = await bf.get_postion();
  const lastOrder = await redisDb.get("lastOrder");

  // jika tidak ada posisi yang aktiv
  if (!activePosition) {
    // jika tidak ada posisi dan posisi terakhir adalah has_position = true
    // maka berarti posisi telah di tutup
    if (has_position == true) {
      console.log("Order selesai");
      has_position = false;
      await bf.cancel_all_order();
    }

    if(lastOrder.status == 'position') {
      await redisDb.set("lastOrder", {
        status: false,
        takeProfit: false,
        side: false,
      });
    }

    return true;
  } else {
    let positionMarkPrice = Number.parseFloat(activePosition.markPrice);
    let qty = Number.parseFloat(activePosition.positionAmt);
    const entryPrice = Number.parseFloat(activePosition.entryPrice);
    const currentPnl = Number.parseFloat(activePosition.unRealizedProfit);

    const type = qty < 0 ? "sell" : "buy";
    qty = Math.abs(qty);

    console.log("mempunyai posisi yang aktiv", {
      type,
      qty,
      entryPrice,
      positionMarkPrice,
      currentPnl,
    });

    // update redis database last order bahwa status sedang dalam posisi
    has_position = true;
    await redisDb.set("lastOrder", {
      status: "position",
      side: type,
    });

    const takeProfitOrder = await bf.get_take_profit_order();

    // jika sudah punya takeProfit maka lewati fungsi
    // jika markprice masih lebih dari take profit order price maka lewati
    // karna harga masih aman

    // jika sudah mempunyai take profit order
    if (takeProfitOrder) {
      let takeProfitPrice = Number.parseFloat(takeProfitOrder.price);
      console.log("sudah mempunyai order take profit", {
        takeProfitPrice,
      });

      if (type == "buy") {
        if (positionMarkPrice <= takeProfitPrice) {
          return false;
        }
      } else {
        if (positionMarkPrice >= takeProfitPrice) {
          return false;
        }
      }
    }

    // jika belum mempunyai take profit order
    // buatkan take profit
    let targetProfitPrice = bf.generate_target_price(type, qty, entryPrice);

    // jika target profit sudah terlewati oleh harga sekarang
    // maka buatlah targetProfitPrice = dengan harga sekarng  / langsung take profit
    if (type == "buy") {
      if (positionMarkPrice > targetProfitPrice) {
        // targetProfitPrice = positionMarkPrice;

        // await bf.cancel_all_order();
        await bf.close_all_position();
        return false;
      }
    } else {
      if (positionMarkPrice < targetProfitPrice) {
        // targetProfitPrice = positionMarkPrice;

        // await bf.cancel_all_order();
        await bf.close_all_position();
        return false;
      }
    }

    // cancel order terlebih dahulu sebelum menggunakan take profit
    await bf.cancel_all_order();
    await bf.submit_take_profit(type, qty, targetProfitPrice);
    return true;
  }
}

// start infinity loop
async function execute_loop() {
  while (true) {
    execute_bot();
    await new Promise((resolve) => setTimeout(resolve, sleep_time));
  }
}

execute_loop();

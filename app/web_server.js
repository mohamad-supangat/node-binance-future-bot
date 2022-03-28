/**
 * Webserver untuk menerima signal yang berupa rest api
 * semisal dari trading view dan Crypto Signal Python
 */

const express = require("express");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");

const bf = require("../bot_function.js");
const tradingview_ta = require("../lib/tradingview_ta");
const { config } = require("../config.js");
const db = require("../db.js");
const { redisDb, initRedis } = require("../redis.js");

// some init config
const app = express();
const port = 3000;

// set pug as template
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

const upload = multer();
app.use(upload.array()); // for parsing multipart/form-data

// binance init leverage and margin type
bf.init_binance();
// init redis db default data
initRedis();

// home rest
app.get("/", (req, res) => {
  res.render("index", { title: "Bismillah sukses" });
});

// trigger data dari api rest url / trading view app
app.get("/post_order/:type", async (req, res) => {
  const type = req.params.type;
  const ta_signal = await tradingview_ta.get_signal();

  // jika order sama dengan sebelumnya maka jangan paksa order
  const lastOrder = (await redisDb.get("lastOrder")) ?? {};

  bf.send_log(
    JSON.stringify({
      hook_signal: type,
      ta_signal: ta_signal,
      lastOrder: lastOrder,
    })
  );

  if (type == ta_signal && type != lastOrder.side) {
    console.log("Persiapan pasang order");
    // check dulu apakah masih ada order yang masih menggantung
    if (lastOrder.status == "position") {
      // jika masih ada posisi yang terbuka dan berlawanan maka close dahulu
      if (config.close_all_position_if_signal_change) {
        await bf.close_all_position();
      } else {
        // jika tidak maka jangan lakukan apapun dan berikan sinyal false
        res.send(false);
        return false;
      }
    }

    // cancel all order sebelum melakukan submit order agar tidak ada order yang menumpuk
    await bf.cancel_all_order();

    const price = await bf.get_market_price();
    bf.trigger_webhook({
      type: type,
      price: price,
    });
  }

  res.send(true);
});

// retrive webhook
app.post("/webhook", async (req, res) => {
  // console.log(req.body);
  const signals = JSON.parse(req.body.messages);
  for (const signal of signals) {
    const candle_period = signal.analysis.config
      ? signal.analysis.config.candle_period
      : null;

    const price = signal.price_value ? signal.price_value.close : null;

    let status = "netral";
    if (signal.status == "cold") {
      status = "sell";
    } else if (signal.status == "hot") {
      status = "buy";
    }

    // check jika signal yang di dapat sesuai dengan config
    const check =
      status != "netral" &&
      signal.market == config.market &&
      signal.indicator == config.indicator &&
      candle_period == config.candle_period &&
      price != null;

    console.log("check market", check, candle_period);
    // const ta_signal = await tradingview_ta.get_signal();
    // if (check && status == ta_signal) {
    if (check) {
      bf.trigger_webhook({
        type: status,
        price: price,
      });
    }
  }
  res.send(true);
});

app.get("/histories", async (req, res) => {
  let items = await db.table("trades").orderBy("id", "ASC").select();
  res.render("histories", {
    title: "Bismillah sukses",
    items: items,
  });
});

// post order
/* app.get("/post_order/:type", async (req, res) => {
  const type = req.params.type;
  const latest_position = await bf.get_last_position();
  let cross = true;

  // sudah pernah mengambil posisi dan posisi ternyata sama
  if (latest_position && latest_position.type == type) {
    bf.send_log("Posisi sama dengan yang sudah terpasang sebelumnya", res);
  } else {
    let qty;

    //  jika tidak mempunyai posisi terakhir maka generate qty untuk order pertama
    if (!latest_position) {
      qty = await bf.generate_qty_order();
    } else {
      // jika sebelumnya sudah ada order maka generate 2x dari posisi terakhir untuk menutup dan langsung membuka order yang baru
      qty = Number.parseFloat(latest_position.qty);
      cross = true;
    }

    // console.log(qty)
    await bf.create_order(type, qty, "Trigger dari post_order " + type, {
      cross: cross,
    });
    res.send(true);
  }
}); */

// start app
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

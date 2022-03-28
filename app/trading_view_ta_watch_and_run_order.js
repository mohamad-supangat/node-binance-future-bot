const {
  EXCHANGES_ENUM,
  INTERVALS_ENUM,
  SCREENERS_ENUM,
  TradingViewScan,
} = require("./../lib/tradingview-ta/index.js");

const bf = require("./../bot_function.js");
const { config } = require("./../config.js");

const sleep_time = Number.parseFloat(config.trading_view_loop_sleep_time) * 1000; // in milisecond

// some tmp var
let last_signal;

// fungsi untuk mendapakan sinyal
async function get_signal() {
  const result = await new TradingViewScan(
    SCREENERS_ENUM["crypto"],
    EXCHANGES_ENUM["BINANCE"],
    config.tradingview_symbol,
    INTERVALS_ENUM[config.candle_period]
    // You can pass axios instance. It's optional argument (you can use it for pass custom headers or proxy)
  ).analyze();

  let signal = result.summary["RECOMMENDATION"];
  signal = signal.toLowerCase();

  // check if 'strong sell' signal
  if (signal.includes("sell")) {
    signal = "sell";
  } else if (signal.includes("buy")) {
    signal = "buy";
  } else {
    signal = "neutral";
  }

  console.log("signal ", signal, last_signal);

  // check cross signal
  // jika signal bukan netral dan cross sudah lebih >= 1

  if (signal != "neutral") {
    // jika signal bukan netral
    // jika cross pertama maka cari sinyal cross
    if (!last_signal) {
      last_signal = signal;
    } else {
      if (last_signal != signal) {
        // jika cross maka send data
        const price = await bf.get_market_price();
        console.log(`signal ${signal}, price: ${price}`);

        bf.trigger_webhook({
          type: signal,
          price: price,
        });

        last_signal = signal;
      }
    }
  }
}

// fungsi untuk mengeksekusi bot looping
async function execute_loop() {
  while (true) {
    
    try {
      get_signal();
    } catch {
      get_signal();
    }
    
    await new Promise((resolve) => setTimeout(resolve, sleep_time));
  }
}

execute_loop();

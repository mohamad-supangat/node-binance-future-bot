const TradingView = require("@mathieuc/tradingview");

const client = new TradingView.Client();

const chart = new client.Session.Chart();

chart.setMarket("BINANCE:XMRUSDTPERP", {
  timeframe: "5",
  range: 50, // Can be positive to get before or negative to get after
  // to: 1600000000,
});

chart.setTimezone("Asia/Jakarta");
// chart.setSeries('15');

// This works with indicators

TradingView.getIndicator("PUB;ra5bW3NfCYBvMNBUfDZ94xAyTn6f3Ae6").then(
  async (indic) => {
    // indic.setOption('keyvalue', 6);

    console.log(`Loading '${indic.description}' study...`);
    /* const SUPERTREND = new chart.Study(indic);

  SUPERTREND.onUpdate(() => {
    console.log("Prices periods:", chart.periods);
    console.log("Study periods:", SUPERTREND.periods);
    // client.end();
  }); */

    const STD = new chart.Study(indic);

    STD.onError((...err) => {
      console.log("Study error:", ...err);
    });

    STD.onReady(() => {
      console.log(`STD '${STD.instance.description}' Loaded !`);
    });

    STD.onUpdate(() => {
      console.log("Graphic data:", STD.periods);
      // console.log('Tables:', changes, STD.graphic.tables);
      // console.log('Cells', STD.graphic.tables[0].cells());
      client.end();
    });
  },
);

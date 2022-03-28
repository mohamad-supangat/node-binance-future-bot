const bf = require("../../bot_function.js");
const { config } = require("../../config.js");
const binance = bf.binance();

(async () => {
  // console.log(await binance.futuresAccount());

  // console.info(await binance.futuresGetDataStream());

  let position_data = await binance.futuresPositionRisk(),
    markets = Object.keys(position_data);
  for (let market of markets) {
    let obj = position_data[market],
      size = Number(obj.positionAmt);
    if (size == 0) continue;

    // console.log(market);

    console.log(obj);

    console.info(`${obj.leverage}x\t${obj.symbol}\t${obj.unRealizedProfit}`);
    //console.info( obj ); //positionAmt entryPrice markPrice unRealizedProfit liquidationPrice leverage marginType isolatedMargin isAutoAddMargin maxNotionalValue
  }
})();

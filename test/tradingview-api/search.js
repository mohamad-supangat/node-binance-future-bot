const TradingView = require("@mathieuc/tradingview");

/*
  This example tests the searching
  functions such as 'searchMarket'
  and 'searchIndicator'
*/

// TradingView.searchMarket('BINANCE:').then((rs) => {
//   console.log('Found Markets:', rs);
// });

TradingView.searchIndicator("Scalping PullBack").then((rs) => {
  console.log("Found Indicators:", rs);
});

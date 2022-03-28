const ta = require("../lib/tradingview_ta");

(async () => {
  // console.log(ta);
  const result = await ta.get_signal('moving_averages');
  console.log(result);
})();

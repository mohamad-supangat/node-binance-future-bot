const ta = require("../lib/tradingview-ta");

(async () => {
  const result = await ta.get_signal();
  console.log(result);
})();

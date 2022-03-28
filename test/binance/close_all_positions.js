const bf = require("../../bot_function.js");
const { config } = require("../../config.js");

(async () => {
  console.log(await bf.close_all_position());
  // await bf.cancel_all_order();
})();

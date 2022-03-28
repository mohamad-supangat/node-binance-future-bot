const bf = require("../bot_function.js");

price = 0.3;
async function test() {
  await bf.check_fill_and_close(price);
}

test();

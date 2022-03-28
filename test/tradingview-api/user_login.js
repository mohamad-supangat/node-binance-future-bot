const TradingView = require("@mathieuc/tradingview");

/*
  This example tests the
  user login function
*/

TradingView.loginUser('zpid404@gmail.com', 'Kasegeran1712!!', false).then((user) => {
  console.log("User:", user);
  console.log("Sessionid:", user.session);
}).catch((err) => {
  console.error("Login error:", err.message);
});

const { redisDb, initRedis } = require("../redis.js");
(async () => {
  
  await initRedis();


  await redisDb.set("lastOrder", {
    status: "open",
    side: "sell",
  });

  let lastOrder = await redisDb.get("lastOrder");
  lastOrder = lastOrder ? lastOrder : null;

  console.log(lastOrder);
})();

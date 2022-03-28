const Redis = require("ioredis");
const JSONCache = require("redis-json");

const redis = new Redis();
exports.redisDb = new JSONCache(redis, { prefix: "cache:" });
exports.initRedis = async function () {
  // console.log(redisDb)
  await exports.redisDb.set("market", {
    price: 0,
  });

  await exports.redisDb.set("lastOrder", {
    status: false,
    takeProfit: false,
    side: false,
  });
};

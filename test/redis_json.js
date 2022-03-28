const Redis = require("ioredis");
const JSONCache = require("redis-json");

const redis = new Redis();

const user = {
  name: "redis-json",
  age: 25,
  address: {
    doorNo: "12B",
    locality: "pentagon",
    pincode: 123456,
  },
  cars: ["BMW 520i", "Audo A8"],
};

(async () => {
  const jsonCache =
    new JSONCache(redis, { prefix: "cache:" });


  console.log(jsonCache)
  await jsonCache.set("123", user);

  console.log(await jsonCache.get("123"))
  // output
  // {
  //   name: 'redis-json',
  //   age: 25,
  //   address: {
  //     doorNo: '12B',
  //     locality: 'pentagon',
  //     pincode: 123456
  //   },
  //   cars: ['BMW 520i', 'Audo A8']
  // }

  await jsonCache.set("123", { gender: "male" });
  console.log(await jsonCache.get("123"));
  // output
  // {
  //   name: 'redis-json',
  //   age: 25,
  //   address: {
  //     doorNo: '12B',
  //     locality: 'pentagon',
  //     pincode: 123456
  //   },
  //   cars: ['BMW 520i', 'Audo A8']
  //   gender: 'male'
  // }

  await jsonCache.get("123", "name", "age");
  // output
  // {
  //   name: 'redis-json',
  //   age: 25,
  // }

  await jsonCache.get("123", "name", "address.doorNo");
  // {
  //   name: 'redis-json',
  //   address: {
  //     doorNo: '12B'
  //   }
  // }

  await jsonCache.clearAll();

  await jsonCache.get("123");
  // undefined

  await jsonCache.incr("123", { age: 1 }); // increments age by 1
})();

const redis = require("redis");


let redisClient;

// Function to connect to Redis
async function connectToRedis() {
 try{ redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error: ${error}`));

  const connectAsync = redisClient.connect();
  await connectAsync;
 } catch (error) {
  throw error;    
}
}

// Function to get data from Redis cache
async function getFromRedisCache(key) {
  try {
  
    let cacheData = await redisClient.get(key);
    return JSON.parse(cacheData);
  } catch (error) {
    throw error;    
  }
}

// Function to set data in Redis cache
async function setInRedisCache(key, data) {
try{
  let setAsync = await redisClient.set(key, JSON.stringify(data));
  await setAsync;
}  catch (error) {
    throw error;    
  }
}

module.exports = {
  connectToRedis,
  getFromRedisCache,
  setInRedisCache,
};

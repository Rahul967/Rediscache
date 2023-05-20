


  async function connectToRedis() {
    return new Promise((resolve, reject) => {
        const redisClient = redis.createClient();
  
      redisClient.on("error", (error) => {
        console.error(`Error: ${error}`);
        reject(error);
      });
  
      redisClient.on("connect", () => {
        console.log("Connected to Redis");
        resolve(redisClient);
      });
    });
  }


  
async function getFromRedis(key) {
    try {
      return await new Promise((resolve, reject) => {
        redisClient.get(key, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function setToRedis(key, value) {
    try {
      return await new Promise((resolve, reject) => {
        redisClient.set(key, value, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }






    module.exports = {
        connectToRedis,
        getFromRedis,
        setToRedis,
        };
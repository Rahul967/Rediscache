const express = require("express");
const axios = require("axios");
const redis = require("redis");
const app = express();
const port = process.env.PORT || 3000;


let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();


/**
 * 
 * @param {*} species 
 * @returns {*} species data fetched from the api
 */
async function fetchApiData(species) {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${species}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}


/**
 * 
 * @param {*} req  
 * @param {*} res
 * @returns {*} checks if data returned from the api is empty or not and sends the data to the client else sends an error message
 */
async function getSpeciesData(req, res) {
    const species = req.params.species;
    let results;
    let isCached = false;

    try {
    const cacheResults = await redisClient.get(species);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchApiData(species);
      if (results.length === 0) {
        throw "API returned an empty array";
     }
     await redisClient.set(species, JSON.stringify(results));
    }

    res.send({
      fromCache: isCached,
      data: results,
    })} catch (error) {
      console.error(error);
      res.status(404).send("Data unavailable");
    }
  }
  

app.get("/fish/:species", getSpeciesData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
const express = require("express");
const axios = require("axios");
const { connectToRedis, getFromRedisCache, setInRedisCache } = require("./redis.utils");
const app = express();
const port = process.env.PORT || 3000;

(async () => {
  await connectToRedis();
})();

/**
 * @param {*} species
 * @returns {*} species data fetched from the API
 */
async function fetchApiData(species) {
  const apiResponse = await axios.get(
    `https://www.fishwatch.gov/api/species/${species}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

/**
 * @param {*} req
 * @param {*} res
 * @returns {*} checks if data returned from the API is empty or not and sends the data to the client, otherwise sends an error message
 */
async function getSpeciesData(req, res) {
  const species = req.params.species;
  let results;
  let isCached = false;

  try {
    const cacheResults = await getFromRedisCache(species);
    if (cacheResults) {
      isCached = true;
      results = cacheResults;
    } else {
      results = await fetchApiData(species);
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await setInRedisCache(species, results);
    }

    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

app.get("/fish/:species", getSpeciesData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

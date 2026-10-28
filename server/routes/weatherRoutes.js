const express = require("express");

const { getWeather,getForecast } = require("../controllers/weatherController");

const router = express.Router();

// Get current weather
router.get("/", getWeather);

// Get 5-day forecast
router.get("/forecast", getForecast);

module.exports = router;

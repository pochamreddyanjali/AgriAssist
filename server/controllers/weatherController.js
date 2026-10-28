const axios = require("axios");

// ===============================
// Get Current Weather
// ===============================
const getWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: "City or latitude and longitude are required",
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          ...(lat && lon
            ? {
                lat: lat,
                lon: lon,
              }
            : {
                q: city,
              }),

          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      },
    );

    const weather = response.data;

    return res.status(200).json({
      success: true,

      weather: {
        city: weather.name,
        country: weather.sys.country,

        temperature: weather.main.temp,
        feelsLike: weather.main.feels_like,

        humidity: weather.main.humidity,

        condition: weather.weather[0].main,
        description: weather.weather[0].description,
        icon: weather.weather[0].icon,

        windSpeed: weather.wind.speed,
      },
    });
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to fetch weather data",
    });
  }
};

// ===============================
// Get 5-Day Weather Forecast
// ===============================
const getForecast = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: "City or latitude and longitude are required",
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          ...(lat && lon
            ? {
                lat: lat,
                lon: lon,
              }
            : {
                q: city,
              }),

          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      },
    );

    const forecastData = response.data;

    const forecast = forecastData.list.map((item) => ({
      dateTime: item.dt_txt,

      temperature: item.main.temp,
      feelsLike: item.main.feels_like,

      humidity: item.main.humidity,

      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,

      windSpeed: item.wind.speed,

      rainProbability: item.pop,
    }));

    return res.status(200).json({
      success: true,

      city: forecastData.city.name,
      country: forecastData.city.country,

      forecast,
    });
  } catch (error) {
    console.error("Forecast API Error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to fetch forecast data",
    });
  }
};

module.exports = {
  getWeather,
  getForecast,
};

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Weather.css";

/* ---------- small helpers (new) ---------- */

// Line icon chosen from the description text OpenWeather returns.
function WeatherIcon({ description = "", size = 32, color = "currentColor" }) {
  const s = description.toLowerCase();
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (s.includes("rain") || s.includes("drizzle") || s.includes("thunder")) {
    return (
      <svg {...props}>
        <path d="M7 15a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 6.5 4.25 4.25 0 0 1 17.5 15H7z" />
        <path d="M8 18v2M12 18v3M16 18v2" />
      </svg>
    );
  }
  if (s.includes("clear")) {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.5 4.25 4.25 0 0 1 17.5 18H7z" />
    </svg>
  );
}

const formatDay = (dateStr, index) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    name:
      index === 0
        ? "Today"
        : d.toLocaleDateString("en-IN", { weekday: "short" }),
    date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  };
};

/* ---------- component ---------- */

function Weather() {
  const [city, setCity] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");

      // Current weather
      const weatherResponse = await axios.get(
        "http://localhost:5000/api/weather",
        {
          params: {
            city: city,
          },
        },
      );

      // 5-day forecast
      const forecastResponse = await axios.get(
        "http://localhost:5000/api/weather/forecast",
        {
          params: {
            city: city,
          },
        },
      );

      setWeather(weatherResponse.data.weather);
      setForecast(forecastResponse.data.forecast);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Unable to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({
          latitude,
          longitude,
        });

        try {
          setLoading(true);
          setError("");

          const weatherResponse = await axios.get(
            "http://localhost:5000/api/weather",
            {
              params: {
                lat: latitude,
                lon: longitude,
              },
            },
          );

          setWeather(weatherResponse.data.weather);

          const forecastResponse = await axios.get(
            "http://localhost:5000/api/weather/forecast",
            {
              params: {
                lat: latitude,
                lon: longitude,
              },
            },
          );

          setForecast(forecastResponse.data.forecast);

          // Get city name returned by OpenWeather
          setCity(weatherResponse.data.weather.city);
        } catch (error) {
          console.error(error);

          setError(error.response?.data?.message || "Unable to fetch weather");
        } finally {
          setLoading(false);
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error("Location Error:", error);

        setLocationLoading(false);
        setLoading(false);

        setError(
          "Location permission was denied. Please search for your city manually.",
        );
      },
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const dailyForecast = forecast.reduce((days, item) => {
    const date = item.dateTime.split(" ")[0];

    if (!days[date]) {
      days[date] = [];
    }

    days[date].push(item);

    return days;
  }, {});
  const fiveDayForecast = Object.entries(dailyForecast).slice(0, 5);

  const getWeatherAdvice = () => {
    if (!weather) {
      return null;
    }

    const rainProbability =
      forecast.length > 0
        ? Math.max(...forecast.slice(0, 8).map((item) => item.rainProbability))
        : 0;

    const temperature = weather.temperature;
    const windSpeed = weather.windSpeed;

    // High chance of rain
    if (rainProbability >= 0.7) {
      return {
        tone: "watch",
        title: "Rain expected",
        message:
          "A high chance of rain is expected. Consider checking soil moisture before irrigation and avoid unnecessary watering.",
      };
    }

    // High temperature
    if (temperature >= 35) {
      return {
        tone: "watch",
        title: "High temperature",
        message:
          "High temperatures are expected. Monitor crop water requirements and consider irrigation during cooler hours.",
      };
    }

    // Strong wind
    if (windSpeed >= 8) {
      return {
        tone: "watch",
        title: "Strong winds",
        message:
          "Strong winds are expected. Consider avoiding pesticide or fertilizer spraying during windy conditions.",
      };
    }

    // Normal conditions
    return {
      tone: "good",
      title: "Favorable conditions",
      message:
        "Weather conditions currently appear relatively stable. Continue monitoring the forecast before planning farm activities.",
    };
  };
  const advice = getWeatherAdvice();

  const handleSearch = (e) => {
    e.preventDefault(); // lets the Enter key search too
    fetchWeather();
  };

  return (
    <div className="weather-container">
      <header className="wx-top">
        <div>
          <Link to="/dashboard" className="wx-back">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Back to dashboard
          </Link>
          <h1 className="wx-brand">Weather</h1>
        </div>

        {/* City Search */}
        <form className="wx-search" onSubmit={handleSearch} role="search">
          <label htmlFor="wx-city" className="wx-sr">
            Search for a place
          </label>
          <input
            id="wx-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search village, town or city"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading…" : "Search"}
          </button>
        </form>
      </header>

      {error && (
        <p className="weather-error" role="alert">
          {error}
        </p>
      )}

      {locationLoading && !weather && !error && (
        <p className="wx-status">Finding weather for your location…</p>
      )}

      {/* Current Weather + advice */}
      {weather && (
        <section
          className="wx-now"
          aria-label={`Current weather in ${weather.city}`}
        >
          <div className="wx-now-main">
            <p className="wx-place">
              {weather.city}, {weather.country}
            </p>
            <p className="wx-temp">
              {Math.round(weather.temperature)}
              <span>°C</span>
            </p>
            <p className="wx-cond">
              <WeatherIcon description={weather.description} size={28} />
              {weather.description}
            </p>
            <dl className="wx-stats">
              <div>
                <dt>Feels like</dt>
                <dd>{Math.round(weather.feelsLike)}°C</dd>
              </div>
              <div>
                <dt>Humidity</dt>
                <dd>{weather.humidity}%</dd>
              </div>
              <div>
                <dt>Wind</dt>
                <dd>{weather.windSpeed} m/s</dd>
              </div>
            </dl>
          </div>

          {advice && (
            <aside className={`weather-advice weather-advice--${advice.tone}`}>
              <h2>{advice.title}</h2>
              <p>{advice.message}</p>
            </aside>
          )}
        </section>
      )}

      {/* Forecast */}
      {fiveDayForecast.length > 0 && (
        <section aria-labelledby="wx-forecast-title">
          <h2 id="wx-forecast-title" className="wx-h2">
            Next 5 days
          </h2>
          <p className="wx-hint">
            Taller blue bars mean a higher chance of rain.
          </p>

          <ol className="weather-forecast">
            {fiveDayForecast.map(([date, items], index) => {
              const temperatures = items.map((item) => item.temperature);

              const maxTemperature = Math.max(...temperatures);

              const minTemperature = Math.min(...temperatures);

              const maxRainProbability = Math.max(
                ...items.map((item) => item.rainProbability),
              );

              const mainCondition = items[Math.floor(items.length / 2)];

              const rainPercent = Math.round(maxRainProbability * 100);
              const day = formatDay(date, index);

              return (
                <li
                  className={`forecast-card${rainPercent >= 60 ? " is-wet" : ""}`}
                  key={date}
                >
                  <p className="forecast-day">{day.name}</p>
                  <p className="forecast-date">{day.date}</p>

                  <div className="forecast-icon">
                    <WeatherIcon
                      description={mainCondition.description}
                      size={32}
                    />
                  </div>

                  <p className="forecast-condition">
                    {mainCondition.description}
                  </p>

                  <div
                    className="forecast-bar"
                    role="img"
                    aria-label={`${rainPercent}% chance of rain`}
                  >
                    <span style={{ height: `${Math.max(rainPercent, 3)}%` }} />
                  </div>

                  <p className="forecast-rain">{rainPercent}% rain</p>

                  <p className="forecast-temperature">
                    {Math.round(minTemperature)}° – {Math.round(maxTemperature)}
                    °
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}

export default Weather;

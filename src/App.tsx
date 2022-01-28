import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "react-loader-spinner";

interface Weather {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
  };
  weather: { main: string }[];
}

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=Nigeria&units=metric&appid=${process.env.REACT_APP_API}`
      )
      .then((res) => {
        const { data } = res;
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${process.env.REACT_APP_API}`
      );

      setWeather(data);
      setQuery("");
      setSearching(false);
    } catch (error: any) {
      setError(error?.response?.data?.message);
      setWeather(null);
      setSearching(false);
    }
  };

  const generateDate = (d: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <main className={`app ${weather && weather?.main?.temp < 16 && "cold"}`}>
      <div className="container">
        <div className="search-box">
          <form onSubmit={search}>
            <input
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="search-bar"
              placeholder="search weather..."
              value={query}
              disabled={loading}
            />
          </form>
        </div>

        {loading && (
          <div className="loading">
            <Grid color="#fff" height={80} width={80} />
          </div>
        )}

        {searching ? (
          <div className="loading">
            <Grid color="#fff" height={80} width={80} />
          </div>
        ) : weather ? (
          <>
            <div className="weather-location">
              <div className="location">
                {weather?.name}, {weather?.sys?.country}
              </div>
              <div className="date">{generateDate(new Date())}</div>
            </div>
            <div className="weather-container">
              <span className="temp">
                {weather?.main && Math.round(weather?.main?.temp)}&deg;C
              </span>
              <div className="weather">{weather?.weather[0]?.main}</div>
            </div>
          </>
        ) : (
          error && <h1 className="error">{error}</h1>
        )}
      </div>
    </main>
  );
};

export default App;

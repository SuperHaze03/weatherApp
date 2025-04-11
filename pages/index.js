import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    try {
      setError("");
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setWeather(null);
      setError("Kota tidak ditemukan.");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          setWeather(response.data);
          setCity(response.data.name);
        } catch (err) {
          console.log("Gagal deteksi lokasi otomatis");
        }
      });
    }
  }, []);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.title}>🌤️ Weather App</h1>

      <div>
        <select
          onChange={(e) => {
            setCity(e.target.value);
            fetchWeather(e.target.value);
          }}
          value={city}
          className={styles.selectBox}
        >
          <option value="">Pilih kota populer</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Surabaya">Surabaya</option>
          <option value="Yogyakarta">Yogyakarta</option>
          <option value="Denpasar">Denpasar</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Masukkan nama kota"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={styles.input}
        />
        <button
          onClick={() => fetchWeather(city)}
          className={styles.button}
        >
          Cari
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            className={styles.error}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {weather && (
          <motion.div
            className={styles.weatherBox}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
            <p>🌡️ Suhu: {weather.main.temp}°C</p>
            <p>☁️ Cuaca: {weather.weather[0].description}</p>
            <p>💨 Angin: {weather.wind.speed} m/s</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
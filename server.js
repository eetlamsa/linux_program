
const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();
const PORT = 80;

const API_KEY = "b71297ed946c415aaf4626806f6b8b20"; 
const CITY = "Helsinki";


const db = new sqlite3.Database("weather.db");

db.run(`
  CREATE TABLE IF NOT EXISTS weather (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    temperature REAL,
    timestamp TEXT )`);

// --- FRONTEND ---
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

// --- API: UPDATE ---
app.get("/api/update", async (req, res) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&unitS=metric&appid=${API_KEY}';

   
    const response = await fetch(url);
    const data = await response.json();

      console.log("Weather API response:", data);

    // VIRHETARKISTUS, BACKENDIN KANSSA ALUKSI VAIKEUKSIA...
    if (!data.main || typeof data.main.temp !== "number") {
      return res.status(500).json({
        error: "Weather API error",
        apiResponse: data
      });
    }

    const temp = data.main.temp;
    const time = new Date().toISOString();

    db.run(
      "INSERT INTO weather (city, temperature, timestamp) VALUES (?, ?, ?)",
      [CITY, temp, time],
      (err) => {
        if (err) console.error("DB error:", err.message);
        });

         res.json({ status: "ok", temperature: temp });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/data", (req, res) => {
  db.all(
    "SELECT * FROM weather ORDER BY timestamp DESC LIMIT 10",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});


app.listen(80, "0.0.0.0", () => {
  console.log(`Server running on port ${80}`);
});





    

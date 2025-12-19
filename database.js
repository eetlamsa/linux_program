
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("weather.db");

db.serialize(() => {

db.run('CREATE TABLE IF NOT EXISTS weather ( id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT, temperature REAL, timestamp TEXT)');
});

module.exports = db;



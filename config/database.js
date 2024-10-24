const sqlite3 = require("sqlite3").verbose();

const DB_PATH = "./database.db";

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err);
  } else {
    console.log("connected to db", db);
  }
});

module.exports = db;

const Database = require('better-sqlite3');
const path = require('path');

let dbInstance = null;

function connect(dbPath = 'tezz.db') {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);
    // Enable WAL mode for better concurrency performance
    dbInstance.pragma('journal_mode = WAL');
  }
  return dbInstance;
}

function getDb() {
  if (!dbInstance) {
    throw new Error("Database not connected. Call connect('sqlite://filename.db') first.");
  }
  return dbInstance;
}

module.exports = {
  connect,
  getDb
};

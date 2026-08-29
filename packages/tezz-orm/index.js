const { connect, getDb } = require('./Database');

class Model {
  static get tableName() {
    return this.name.toLowerCase() + 's';
  }

  static createTableIfNotExists(data) {
    const db = getDb();
    const columns = Object.keys(data).map(key => {
      let type = 'TEXT';
      if (typeof data[key] === 'number') type = 'INTEGER';
      else if (typeof data[key] === 'boolean') type = 'BOOLEAN';
      return `${key} ${type}`;
    }).join(', ');

    const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns}, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`;
    db.prepare(query).run();
  }

  static create(data) {
    const db = getDb();
    this.createTableIfNotExists(data);

    const keys = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const info = db.prepare(`INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders})`).run(...values);
    return this.find(info.lastInsertRowid);
  }

  static find(id) {
    const db = getDb();
    try {
        const row = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id);
        return row;
    } catch (e) {
        // Table might not exist yet
        return null;
    }
  }

  static where(conditions) {
    const db = getDb();
    const keys = Object.keys(conditions).map(k => `${k} = ?`).join(' AND ');
    const values = Object.values(conditions);
    try {
        return db.prepare(`SELECT * FROM ${this.tableName} WHERE ${keys}`).all(...values);
    } catch (e) {
        return [];
    }
  }

  static all() {
    const db = getDb();
    try {
        return db.prepare(`SELECT * FROM ${this.tableName}`).all();
    } catch (e) {
        return [];
    }
  }
}

module.exports = {
  connect,
  Model
};

// Tezz Language — PostgreSQL Client (tezz-postgres)
// Native PostgreSQL client with connection pooling for Tezz backends.

const { Pool } = require('pg');

// Module-level pool registry (singleton cache keyed by connection target)
// Prevents exhausting database connections when createClient() is called inside route handlers.
const pools = new Map();

function normalizeKey(config) {
  if (!config) return 'default';
  if (typeof config === 'string') return config;
  if (config.url) return config.url;
  if (config.connectionString) return config.connectionString;
  const user = config.user || config.username || '';
  const host = config.host || 'localhost';
  const port = config.port || 5432;
  const db = config.database || '';
  return `${user}@${host}:${port}/${db}`;
}

function getPool(config) {
  const key = normalizeKey(config);
  if (pools.has(key)) {
    return pools.get(key);
  }

  const poolConfig = {};

  if (typeof config === 'string') {
    poolConfig.connectionString = config;
  } else if (config) {
    if (config.url || config.connectionString) {
      poolConfig.connectionString = config.url || config.connectionString;
    } else {
      if (config.host) poolConfig.host = config.host;
      if (config.port) poolConfig.port = config.port;
      if (config.user) poolConfig.user = config.user;
      if (config.username) poolConfig.user = config.username;
      if (config.password) poolConfig.password = config.password;
      if (config.database) poolConfig.database = config.database;
    }
    if (config.ssl !== undefined) poolConfig.ssl = config.ssl;
    poolConfig.max = config.max || 10;
    poolConfig.idleTimeoutMillis = config.idleTimeoutMillis || 30000;
    poolConfig.connectionTimeoutMillis = config.connectionTimeoutMillis || 5000;
  }

  const pool = new Pool(poolConfig);

  // Catch errors on idle clients so they do not crash the Node process
  pool.on('error', (err) => {
    console.error('[tezz-postgres] Unexpected idle client error:', err.message);
  });

  pools.set(key, pool);
  return pool;
}

async function closeAllPools() {
  const promises = [];
  for (const pool of pools.values()) {
    promises.push(pool.end().catch(() => {}));
  }
  pools.clear();
  await Promise.all(promises);
}

class TezzPostgres {
  constructor(config, pool) {
    this.config = config;
    this.pool = pool;
  }

  // Primary query interface with parameterized query values ($1, $2, ...)
  async query(sql, args = []) {
    const res = await this.pool.query(sql, args);
    return {
      ok: true,
      rows: res.rows,
      cols: res.fields ? res.fields.map(f => f.name) : [],
      affected: res.rowCount || 0,
      rowCount: res.rowCount || 0
    };
  }

  // Alias to query() for 1:1 API compatibility with tezz-database
  async execute(sql, args = []) {
    return this.query(sql, args);
  }

  // Escape hatch to the underlying pg.Pool for advanced transactions
  get raw() {
    return this.pool;
  }

  // Drain and shut down this specific connection pool
  async close() {
    const key = normalizeKey(this.config);
    pools.delete(key);
    await this.pool.end();
  }
}

function createClient(config) {
  // Support default environment variable lookup if no config is given
  const resolvedConfig = config || (typeof process !== 'undefined' && (process.env.DATABASE_URL || process.env.POSTGRES_URL)) || {};
  const pool = getPool(resolvedConfig);
  return new TezzPostgres(resolvedConfig, pool);
}

// Attach utilities
createClient.TezzPostgres = TezzPostgres;
createClient.getPool = getPool;
createClient.closeAllPools = closeAllPools;
createClient.default = createClient;

module.exports = createClient;
module.exports.default = createClient;
module.exports.createClient = createClient;
module.exports.TezzPostgres = TezzPostgres;
module.exports.getPool = getPool;
module.exports.closeAllPools = closeAllPools;

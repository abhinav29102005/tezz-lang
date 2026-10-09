// Tezz Language — Redis Client (tezz-redis)
// High-performance native Redis client for Tezz backends with connection reuse.

const Redis = require('ioredis');

// Module-level client registry (singleton cache keyed by connection target)
// Prevents spawning new TCP connections when createClient() is called inside route handlers.
const clients = new Map();

function normalizeKey(config) {
  if (!config) return 'default';
  if (typeof config === 'string') return config;
  if (config.url) return config.url;
  if (config.connectionString) return config.connectionString;
  const host = config.host || 'localhost';
  const port = config.port || 6379;
  const db = config.db || 0;
  return `${host}:${port}/${db}`;
}

function getClient(config) {
  const key = normalizeKey(config);
  if (clients.has(key)) {
    return clients.get(key);
  }

  let client;
  const opts = {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false
  };

  if (typeof config === 'string') {
    client = new Redis(config, opts);
  } else if (config && (config.url || config.connectionString)) {
    client = new Redis(config.url || config.connectionString, { ...opts, ...config });
  } else if (config) {
    client = new Redis({
      host: config.host || 'localhost',
      port: config.port || 6379,
      password: config.password,
      db: config.db || 0,
      ...opts,
      ...config
    });
  } else {
    client = new Redis(opts);
  }

  // Catch connection errors so an unreachable Redis does not cause unhandled process crash
  client.on('error', (err) => {
    // Handled in operation promises; logged here for diagnostics
  });

  clients.set(key, client);
  return client;
}

async function closeAllClients() {
  const promises = [];
  for (const client of clients.values()) {
    promises.push(client.quit().catch(() => client.disconnect()));
  }
  clients.clear();
  await Promise.all(promises);
}

class TezzRedis {
  constructor(config, client) {
    this.config = config;
    this.client = client;
  }

  async _ensureConnected() {
    if (this.client.status === 'wait') {
      await this.client.connect();
    }
  }

  // Get string value by key
  async get(key) {
    await this._ensureConnected();
    return await this.client.get(key);
  }

  // Set value with optional TTL (seconds)
  async set(key, value, ttlSeconds = null) {
    await this._ensureConnected();
    const valStr = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
    if (ttlSeconds && Number.isInteger(ttlSeconds) && ttlSeconds > 0) {
      return await this.client.set(key, valStr, 'EX', ttlSeconds);
    }
    return await this.client.set(key, valStr);
  }

  // Delete key(s)
  async del(...keys) {
    await this._ensureConnected();
    return await this.client.del(...keys);
  }

  // Alias for del()
  async delete(...keys) {
    return this.del(...keys);
  }

  // Set expiration in seconds
  async expire(key, seconds) {
    await this._ensureConnected();
    return await this.client.expire(key, seconds);
  }

  // Check if key exists (returns boolean)
  async exists(key) {
    await this._ensureConnected();
    const count = await this.client.exists(key);
    return count > 0;
  }

  // Helper to fetch and auto-parse JSON value
  async jsonGet(key) {
    const raw = await this.get(key);
    if (raw === null || raw === undefined) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  // Helper to set JSON object with optional TTL
  async jsonSet(key, obj, ttlSeconds = null) {
    return await this.set(key, obj, ttlSeconds);
  }

  // Escape hatch to the underlying ioredis instance for all advanced commands
  get raw() {
    return this.client;
  }

  // Close this connection
  async close() {
    const key = normalizeKey(this.config);
    clients.delete(key);
    await this.client.quit().catch(() => this.client.disconnect());
  }
}

function createClient(config) {
  const resolvedConfig = config || (typeof process !== 'undefined' && (process.env.REDIS_URL || process.env.REDIS_CONNECTION_STRING)) || {};
  const client = getClient(resolvedConfig);
  return new TezzRedis(resolvedConfig, client);
}

// Attach utilities
createClient.TezzRedis = TezzRedis;
createClient.getClient = getClient;
createClient.closeAllClients = closeAllClients;
createClient.default = createClient;

module.exports = createClient;
module.exports.default = createClient;
module.exports.createClient = createClient;
module.exports.TezzRedis = TezzRedis;
module.exports.getClient = getClient;
module.exports.closeAllClients = closeAllClients;

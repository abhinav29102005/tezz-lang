# tezz-redis ⚡

High-performance native Redis client for the **Tezz (तेज़)** programming language, featuring automatic connection reuse and native JSON helpers.

## Installation

```bash
# Inside your Tezz project:
npm install tezz-redis

# Or using the Tezz CLI:
tezz install redis
```

## Quick Start (in `.tezz`)

```tezz
import createClient from "tezz-redis"

service CacheAPI on 3002 {
  GET "/cache/:key" {
    let redis = createClient({
      url: env.REDIS_URL || "redis://localhost:6379"
    })

    try {
      let value = await redis.get(params.key)
      if value {
        return { success: true, key: params.key, value: value }
      }
      return { __tezz_status: 404, success: false, error: "Key not found" }
    } catch err {
      return { __tezz_status: 500, success: false, error: "Redis error" }
    }
  }

  POST "/cache/:key" {
    let body = request.json()
    let value = body.value
    let ttl = body.ttl || 3600

    let redis = createClient({
      url: env.REDIS_URL || "redis://localhost:6379"
    })

    try {
      -- Set with automatic expiration (TTL in seconds)
      await redis.set(params.key, value, ttl)
      return { success: true, key: params.key, stored: value, ttl: ttl }
    } catch err {
      return { __tezz_status: 500, success: false, error: "Redis error" }
    }
  }

  DELETE "/cache/:key" {
    let redis = createClient({
      url: env.REDIS_URL || "redis://localhost:6379"
    })

    try {
      await redis.del(params.key)
      return { success: true, message: "Deleted" }
    } catch err {
      return { __tezz_status: 500, success: false, error: "Redis error" }
    }
  }
}
```

## API Reference

### `createClient(config)`
Returns a cached client connected to Redis.

#### Parameters
`config` can be a connection string or an options object:
- `url` or `connectionString` *(string)*: Redis URL (e.g. `redis://:authpassword@localhost:6379/0`).
- `host` *(string)*: Hostname (default: `localhost`).
- `port` *(number)*: Port (default: `6379`).
- `password` *(string)*: Optional password.
- `db` *(number)*: Database index (default: `0`).

If omitted, `createClient()` automatically looks up `env.REDIS_URL` or `env.REDIS_CONNECTION_STRING`.

---

### Core Operations

- **`await redis.get(key)`**: Retrieves the string value for `key`, or `null` if not found.
- **`await redis.set(key, value, [ttlSeconds])`**: Stores `value` (auto-serializes objects to JSON strings). If `ttlSeconds` is provided, sets an expiration timer (`EX`).
- **`await redis.del(...keys)`**: Deletes one or more keys.
- **`await redis.delete(...keys)`**: Alias for `.del()`.
- **`await redis.expire(key, seconds)`**: Sets a timeout on `key` in seconds.
- **`await redis.exists(key)`**: Returns a boolean (`true`/`false`).

---

### JSON Helpers

- **`await redis.jsonGet(key)`**: Retrieves `key` and automatically attempts `JSON.parse()`.
- **`await redis.jsonSet(key, object, [ttlSeconds])`**: Encodes `object` as JSON and stores it with optional TTL.

---

### Escape Hatch (`.raw`)
Access the underlying `ioredis` instance for any advanced commands (`hset`, `lpush`, pub/sub):
```tezz
let client = redis.raw
await client.hset("user:1", "name", "Alice")
```

---

### Connection Management
- **`await redis.close()`**: Closes this connection and removes it from the internal cache.
- **`await createClient.closeAllClients()`**: Closes all active Redis connections.

---

## Connection Architecture

Redis uses a pipelined single-connection protocol capable of serving thousands of concurrent requests over a single TCP socket. 

`tezz-redis` maintains an **internal singleton registry** keyed by connection target:
- Calling `createClient({ url })` repeatedly inside route handlers reuses the existing multiplexed connection rather than creating a new TCP socket per HTTP request.
- Offline queueing and lazy connection prevent unhandled process crashes on connection hiccups.

## Runtime Compatibility

| Target | Supported? | Notes |
| :--- | :--- | :--- |
| **Node.js** | **Yes** (Native) | Full TCP pipelining via `ioredis`. |
| **Cloudflare Workers** | **Requires REST Proxy** | Standard Workers do not support raw persistent TCP sockets without external proxies. For edge workers, consider HTTP-based Redis solutions like Upstash. |

## License

MIT © Abhinav

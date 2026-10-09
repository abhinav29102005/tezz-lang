# tezz-postgres 🐘

High-performance native PostgreSQL driver for the **Tezz (तेज़)** programming language, featuring automatic connection pooling and parameterized query protection.

## Installation

```bash
# Inside your Tezz project:
npm install tezz-postgres

# Or using the Tezz CLI:
tezz install postgres
```

## Quick Start (in `.tezz`)

```tezz
import createClient from "tezz-postgres"

service UserAPI on 3000 {
  GET "/users" {
    let db = createClient({
      url: env.DATABASE_URL
    })

    try {
      let result = await db.query("SELECT id, name, email FROM users ORDER BY id DESC LIMIT 50")
      return {
        success: true,
        users: result.rows
      }
    } catch err {
      return { success: false, error: "Database error" }
    }
  }

  POST "/users" {
    let body = request.json()
    let name = body.name
    let email = body.email

    let db = createClient({
      url: env.DATABASE_URL
    })

    try {
      -- Use parameterized queries ($1, $2, ...) to prevent SQL injection
      let result = await db.query(
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
        [name, email]
      )
      return { success: true, user: result.rows[0] }
    } catch err {
      return { success: false, error: "Database error" }
    }
  }
}
```

## API Reference

### `createClient(config)`
Creates or retrieves a pooled PostgreSQL client.

#### Parameters
`config` can be a connection string or an options object:
- `url` or `connectionString` *(string)*: PostgreSQL connection URL (e.g. `postgres://user:password@localhost:5432/dbname`).
- `host` *(string)*: Database host (default: `localhost`).
- `port` *(number)*: Database port (default: `5432`).
- `user` *(string)*: Database username.
- `password` *(string)*: Database password.
- `database` *(string)*: Database name.
- `ssl` *(boolean | object)*: SSL configuration.
- `max` *(number)*: Maximum pool connections (default: `10`).
- `idleTimeoutMillis` *(number)*: Milliseconds before an idle client is closed (default: `30000`).
- `connectionTimeoutMillis` *(number)*: Milliseconds to wait before connection error (default: `5000`).

If omitted, `createClient()` automatically looks up `env.DATABASE_URL` or `env.POSTGRES_URL`.

---

### `db.query(sql, [args])`
Executes a parameterized SQL query on an available connection from the pool.

- **`sql`**: The SQL query string. Placeholders are `$1`, `$2`, `$3`, etc.
- **`args`**: Array of values corresponding to the placeholders.

#### Return Value
Returns an object matching Tezz's standard database return shape:
```javascript
{
  ok: true,          // Boolean status
  rows: [...],       // Array of row objects
  cols: [...],       // Array of column names
  affected: 1,       // Number of affected rows
  rowCount: 1        // Standard pg row count
}
```

### `db.execute(sql, [args])`
Alias for `db.query(sql, args)`, providing 1:1 API compatibility with `tezz-database`.

---

### `db.raw`
Returns the underlying `pg.Pool` instance for advanced scenarios like transaction checkouts (`await db.raw.connect()`).

---

### `db.close()`
Drains and terminates the connection pool for this database URL.

---

### `createClient.closeAllPools()`
Closes all open connection pools. Useful during graceful server termination.

---

## Connection Pooling Architecture

PostgreSQL connections are stateful TCP connections that process one query at a time. Creating a new connection per HTTP request adds latency and quickly exhausts database connection limits.

`tezz-postgres` maintains an **internal singleton pool registry** keyed by connection target:
- Calling `createClient({ url })` repeatedly inside route handlers will **reuse** the existing connection pool rather than opening redundant connections.
- Idle clients are safely reaped, and unexpected idle errors are captured to prevent crashing the server process.

## Runtime Compatibility

| Target | Supported? | Notes |
| :--- | :--- | :--- |
| **Node.js** | **Yes** (Native) | Full TCP pooling via `pg.Pool`. |
| **Cloudflare Workers** | **Requires Proxy / Hyperdrive** | Cloudflare Workers do not support arbitrary raw TCP sockets to external hosts without Cloudflare Hyperdrive or WebSocket-TCP tunnels. For serverless edge deployments, consider Hyperdrive or an HTTP proxy. |

## License

MIT © Abhinav

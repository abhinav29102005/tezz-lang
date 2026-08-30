# Tezz (तेज़) ⚡

**The Fast Backend Language** — Write once, deploy everywhere.
*Officially created by Abhinav.*

**Website:** [tezz.abhinavkumarsingh.tech](https://tezz.abhinavkumarsingh.tech)  
**NPM Package:** [npmjs.com/package/tezz-lang](https://www.npmjs.com/package/tezz-lang)  
**Creator:** [Portfolio](https://abhinavkumarsingh.tech) | [LinkedIn](https://linkedin.com/in/bigboyaks) | [GitHub](https://github.com/abhinav29102005)

Tezz is a brand new programming language designed for backend servers, services, and connectivity. It transpiles to JavaScript so it runs natively on **Cloudflare Workers, Node.js, Deno, and Bun**.

> **Tezz (तेज़)** = Fast / Sharp / Brilliant in Hindi

## Quick Start

```bash
# Install globally
npm install -g tezz-lang

# Create a new project
tezz init

# Run your first service (Fileless JIT Execution - No JS files created!)
tezz run app.tezz
```

## Language Syntax

### Variables & Data Types
```tezz
let name = "Tezz"
let port = 8080
let users = ["Alice", "Bob"]
let config = { debug: true, version: "1.0" }
```

### Services & Routes (The Killer Feature)
```tezz
service API on 3000 {

  route GET "/hello" {
    respond 200 { message: "Hello from Tezz! " }
  }

  route POST "/users" {
    let body = request.json()
    respond 201 { created: true, user: body.name }
  }
}
```

### Advanced Types: Enums & Traits
Tezz features static-typing constructs (similar to Rust) that compile with zero-overhead.
```tezz
enum Status { PENDING, ACTIVE, DELETED }

trait UserProvider {
  fn getUser(id)
  fn saveUser(user)
}
```

### Compile-Time Macros
Deep metaprogramming without runtime overhead. Macros are expanded safely at compile time via the AST.
```tezz
macro log_status(status) {
  print("The current status is:")
  print(status)
}

// In your route:
log_status!(Status.ACTIVE)
```

### Concurrency: Goroutines (`spawn` / `paida_kar`)
Run heavy CPU-bound tasks in parallel! Tezz automatically compiles `spawn` blocks to OS-level `worker_threads` in Node.js, and non-blocking isolates on Cloudflare Edge.
```tezz
spawn {
  print("Running in parallel!")
}
```

### Standard Library Packages
Tezz comes with officially supported decoupled packages. No duplicate code.
```tezz
import auth from "tezz-auth"
import validator from "tezz-validator"
import openapi from "tezz-openapi"
```

## 🛠 CLI Commands

| Command | Description |
|---|---|
| `tezz run <file.tezz>` | Execute fileless in memory |
| `tezz dev <file.tezz>` | Run with instant hot-reloading |
| `tezz build <file.tezz>` | Compile to JavaScript |
| `tezz build <file> --static` | Bundle into a standalone portable binary! |
| `tezz build <file> --target worker` | Compile for Cloudflare Workers |
| `tezz deploy <file.tezz>` | One-click deploy natively to Cloudflare Edge |
| `tezz init` | Create a new project |
| `tezz repl` | Start the interactive Tezz shell |

## ☁ Deploy to Cloudflare Workers

```bash
# Build for Cloudflare Workers
tezz build app.tezz --target worker --output dist/worker.js

# Deploy with Wrangler
npx wrangler deploy dist/worker.js
```

## 🎯 Design Philosophy

| From | What Tezz Takes |
|---|---|
| **Python** | Clean syntax, no semicolons |
| **Go** | Built-in HTTP server, goroutines (`spawn`) |
| **Rust** | Type annotations, Enums, Macros (`!`) |
| **TypeScript** | Runs on JS runtimes, npm ecosystem |
| **Workers** | Edge-first, request/response model |

---
**Made with ❤️ and तेज़ी (speed)**

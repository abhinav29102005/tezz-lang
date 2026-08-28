# ⚡ Tezz (तेज़)

**The Fast Backend Language** — Write once, deploy everywhere.
*Officially created by Abhinav.*

Tezz is a brand new programming language designed for backend servers, services, and connectivity. It transpiles to JavaScript so it runs natively on **Cloudflare Workers, Node.js, Deno, and Bun**.

> **Tezz (तेज़)** = Fast / Sharp / Brilliant in Hindi

## 🚀 Quick Start

```bash
# Install globally
npm install -g tezz-lang

# Create a new project
tezz init

# Run your first service
tezz run app.tezz
```

## 📖 Language Syntax

### Variables
```tezz
let name = "Tezz"
let port = 8080
let users = ["Alice", "Bob"]
let config = { debug: true, version: "1.0" }
```

### Functions
```tezz
fn greet(name: string) -> string {
  return "Hello, {name}!"
}

fn add(a: number, b: number) -> number {
  return a + b
}
```

### Services & Routes (The Killer Feature)
```tezz
service API on 3000 {

  route GET "/hello" {
    respond 200 { message: "Hello from Tezz! ⚡" }
  }

  route POST "/users" {
    let body = request.json()
    respond 201 { created: true, user: body.name }
  }

  route GET "/users/:id" {
    let id = params.id
    respond 200 { id: id }
  }
}
```

### Control Flow
```tezz
if score > 90 {
  respond 200 { grade: "A" }
} else if score > 70 {
  respond 200 { grade: "B" }
} else {
  respond 200 { grade: "C" }
}

for item in items {
  console.log(item)
}
```

### String Interpolation
```tezz
let name = "World"
let greeting = "Hello, {name}!"
-- Result: "Hello, World!"
```

### Built-in Fetch
```tezz
let response = fetch("https://api.example.com/data")
let data = response.json()
```

## 🛠 CLI Commands

| Command | Description |
|---|---|
| `tezz run <file.tezz>` | Compile and run |
| `tezz build <file.tezz>` | Compile to JavaScript |
| `tezz build <file> --target worker` | Compile for Cloudflare Workers |
| `tezz init` | Create a new project |
| `tezz --help` | Show help |

## ☁️ Deploy to Cloudflare Workers

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
| **Go** | Built-in HTTP server, simplicity |
| **Rust** | Type annotations, safety |
| **TypeScript** | Runs on JS runtimes, npm ecosystem |
| **Workers** | Edge-first, request/response model |

## 📁 Project Structure

```
your-project/
├── app.tezz          # Your Tezz source code
├── package.json
└── dist/
    └── worker.js     # Compiled output (for Workers)
```

## 🔧 Built-in Objects

Inside route handlers, you have access to:

- `request.method` — HTTP method
- `request.url` — Request URL path
- `request.headers` — Request headers
- `request.json()` — Parse JSON body
- `request.text()` — Raw body text
- `request.query` — Query parameters
- `params.name` — URL path parameters (from `:name`)

## 📄 License

MIT

---

**Made with ❤️ and तेज़ी (speed)**

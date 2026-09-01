<div align="center">
  <img src="https://raw.githubusercontent.com/abhinav29102005/automatic-octo-carnival/main/website/public/favicon.svg" width="120" alt="Tezz Logo" />
  <h1>⚡ Tezz (तेज़) ⚡</h1>
  <p><strong>The Blazing Fast, Zero-Overhead Language for the Modern Edge</strong></p>
  
  <p>
    <a href="https://www.npmjs.com/package/tezz-lang"><img src="https://img.shields.io/npm/v/tezz-lang?color=00f2fe&label=npm" alt="NPM Version" /></a>
    <a href="https://github.com/abhinav29102005/automatic-octo-carnival/actions"><img src="https://img.shields.io/github/actions/workflow/status/abhinav29102005/automatic-octo-carnival/test.yml?branch=main" alt="Build Status" /></a>
    <a href="https://tezz.abhinavkumarsingh.tech"><img src="https://img.shields.io/badge/docs-tezz.abhinavkumarsingh.tech-4facfe" alt="Documentation" /></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" /></a>
  </p>
</div>

---

**Tezz** is a next-generation transpiled programming language designed to give you the strict, clean, and elegant developer experience (DX) of languages like Rust and Go, while compiling directly into highly optimized, boilerplate-free JavaScript.

*(Tezz translates to "Fast / Sharp / Brilliant" in Hindi)*

## 🚀 The 60-Second Quickstart

```bash
# 1. Install globally
npm install -g tezz-lang

# 2. Create a new project
tezz init my-backend

# 3. Run your first service fileless in memory!
cd my-backend
tezz run app.tezz
```

## ✨ Why Tezz?

JavaScript is the assembly language of the web. Platforms like Cloudflare Workers and V8 runtimes natively execute JS. Instead of building a heavy custom runtime, **Tezz compiles your code directly to raw JavaScript.**

- **Zero-Overhead Edge Deployment**: Runs natively on Cloudflare Workers, Node.js, Deno, and Bun.
- **Vast Ecosystem**: Import and use millions of NPM packages natively.
- **V8 Optimizations**: Tezz rides on billions of dollars of engine optimizations built into V8.
- **🇮🇳 Native Hinglish Support**: Write `rakho` instead of `let`, `agar/warna` instead of `if/else`.

## 💻 Beautifully Simple APIs

The point of Tezz is to eliminate painful boilerplate. You shouldn't have to manually configure CORS or wrangle with JSON parsing.

**You write 10 lines of elegant Tezz:**
```tezz
service API on 8080 {
  route GET "/hello/:name" {
    let name = params.name
    respond 200 { message: "Hello " + name + ", from Tezz!" }
  }
}
```

**Tezz automatically generates 100+ lines of robust JavaScript** handling CORS, routing regex, secure asynchronous payload parsing, and error boundaries. All hidden in a `.tezz/build/` directory!

## 📦 Binaries (No Node.js Required)

Want to run Tezz without installing Node.js? Download the standalone binaries:
- [Mac OS (Apple Silicon / Intel)](#)
- [Linux (x64)](#)
- [Windows (x64)](#)

*(Direct download links coming soon)*

## 🧩 VS Code Extension

Tezz has first-class IDE support.
Search for **Tezz Language Support** in the VS Code Extensions marketplace to get:
- Full Syntax Highlighting
- Code Snippets (e.g., type `service` or `route`)
- Auto-closing brackets and string support.

## 🛠 Advanced Features

### Concurrency: Goroutines (`spawn`)
Run heavy CPU-bound tasks in parallel! Tezz automatically compiles `spawn` blocks to OS-level `worker_threads` in Node.js.
```tezz
spawn {
  print("Running in parallel!")
}
```

### Compile-Time Macros
Deep metaprogramming without runtime overhead.
```tezz
macro log_status(status) {
  print("Status: ")
  print(status)
}

log_status!(Status.ACTIVE)
```

## ☁ Deploy to Cloudflare Workers

```bash
# Build for Cloudflare Workers
tezz build app.tezz --target worker --output dist/worker.js

# Deploy with Wrangler
npx wrangler deploy dist/worker.js
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---
**Made with ❤️ and तेज़ी (speed) by [Abhinav](https://abhinavkumarsingh.tech)**

# ⚡ Tezz Language Support

Premium Syntax Highlighting, Smart Snippets, and Real-time LSP Integration for Tezz.

Tezz is a blazing fast, zero-overhead transpiled language for modern backends, compiling down to raw, highly optimized JavaScript for Node.js or Cloudflare Workers. This official extension provides first-class support for Tezz in Visual Studio Code, ensuring a premium, responsive, and highly productive developer experience (DX).

## 💎 Features

### 1. ✨ Precision Syntax Highlighting
A robust TextMate grammar engine that highlights every detail of the Tezz language:
- **Keywords & Control Flow:** Distinct coloring for `service`, `fn`, `spawn`, `return`, and conditional blocks.
- **HTTP Primitives:** First-class highlighting for `GET`, `POST`, `PUT`, `DELETE` route handlers.
- **Hinglish Support:** Syntax support for Hinglish keywords (`batao`, `jabtak`, `agar`, `warna`, `kaam`).

### 2. 📝 Production-Ready Code Snippets
Get up to speed immediately with our high-productivity autocompletion templates:
- `service` — Bootstraps a highly-concurrent HTTP service block.
- `fn` — Function definitions.
- `spawn` — Asynchronous Goroutine-like background task execution.

### 3. 📡 Native Language Server (LSP) Bridge
Powered by the actual Tezz compiler, the Language Server Protocol integration enables:
- **Real-time Semantic Error Detection:** Instantly maps compiler syntax errors to red squiggles in your editor.
- **Smart Autocompletion:** Context-aware suggestions for core keywords with integrated hover documentation.

## 🛠 Quickstart Guide

1. **Install the Extension:** Install this extension directly from the VS Code Marketplace or Open VSX.
2. **Install Tezz CLI:** Run `npm install -g tezz-lang` in your terminal.
3. **Start Coding:** Create a new file with the `.tezz` extension. VS Code will instantly recognize it, display the official Tezz icon, and activate syntax highlighting and real-time diagnostics!

## 📦 Core Ecosystem Support
Provides autocomplete and LSP hooks for modern backend paradigms:
- Zero-config CORS and regex routing.
- Built-in SQL database connections (e.g., Libsql/Turso).
- Implicit async/await unwrapping.

## 🛡 License
© 2026 Abhinav. All Rights Reserved. Licensed under the MIT License.

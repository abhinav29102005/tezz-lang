# ⚡ Tezz Language Support

Premium Syntax Highlighting, Smart Snippets, and Real-time LSP Integration for Tezz.

Tezz is a blazing fast, zero-overhead transpiled language for modern backends, compiling down to raw, highly optimized JavaScript for Node.js or Cloudflare Workers. This official extension provides first-class support for Tezz in Visual Studio Code, ensuring a premium, responsive, and highly productive developer experience (DX).

## 💎 Features

### 1. ✨ Precision Syntax Highlighting
A robust TextMate grammar engine that highlights every detail of the Tezz language:
- **Keywords & Control Flow:** Distinct coloring for `service`, `fn`, `spawn`, `return`, and conditional blocks.
- **HTTP Primitives:** First-class highlighting for `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS` route handlers.
- **Hinglish Support:** Full syntax support for Hinglish keywords (`rakho`, `pakka`, `agar`, `warna`, `jabtak`, `kaam`, `dikha`, `jawab`, `seva`, `rasta`, and more).
- **OOP Features:** Highlighting for `class`, `extends`, `constructor`, `trait`, `enum`, and their Hinglish equivalents (`dhancha`, `se_bana`, `lakshan`, `vikalp`).
- **Async/Concurrency:** Support for `async`, `await`, `spawn`, `background` and Hinglish variants (`baadmein`, `ruko`).
- **Advanced Syntax:** Macros (`macro!`, `jadoo!`), range operators (`1..10`), arrow functions (`=>`), and more.

### 2. 📝 Production-Ready Code Snippets
Get up to speed immediately with our high-productivity autocompletion templates for both English and Hinglish:

**English Keywords:**
- `service` — HTTP service block
- `route` — HTTP route handler
- `fn` — Function definition
- `class` — Class declaration
- `enum` — Enum definition
- `trait` — Trait/interface definition
- `macro` — Compile-time macro
- `spawn` — Background thread execution
- `background` — Async background task
- `try` — Try-catch block
- `if`, `for`, `while` — Control flow
- And many more...

**Hinglish Keywords:**
- `seva` — Service block (सेवा)
- `rasta` — Route handler (रास्ता)
- `kaam` — Function (काम)
- `dhancha` — Class (ढांचा)
- `vikalp` — Enum (विकल्प)
- `lakshan` — Trait (लक्षण)
- `jadoo` — Macro (जादू)
- `mano` — Let declaration (मानो)
- `pakka` — Const declaration (पक्का)
- `agar`/`warna` — If/else (अगर/वरना)
- `jabtak` — While loop (जबतक)
- `dikha` — Print (दिखा)
- `jawab` — Respond (जवाब)
- `vapas` — Return (वापस)
- `ruko` — Await (रुको)
- And many more...

### 3. 📡 Native Language Server (LSP) Bridge
Powered by the actual Tezz compiler, the Language Server Protocol integration enables:
- **Real-time Semantic Error Detection:** Instantly maps compiler syntax errors to red squiggles in your editor.
- **Smart Autocompletion:** Context-aware suggestions for core keywords with integrated hover documentation.
- **Go to Definition:** Jump to function and class definitions.
- **Diagnostics:** Real-time error and warning messages from the Tezz compiler.

### 4. 🎨 Modern Comment Support
- Line comments with `--` (double dash) - the Tezz standard
- Also supports `//` for JavaScript compatibility
- Block comments with `/* */`

### 5. 🔧 Smart Bracket Pairing
Auto-closing and surrounding pairs for:
- Braces `{}`
- Brackets `[]`
- Parentheses `()`
- Quotes `"` and `'`

## 🛠 Quickstart Guide

1. **Install the Extension:** Install this extension directly from the VS Code Marketplace or Open VSX.
2. **Install Tezz CLI:** Run `npm install -g tezz-lang` in your terminal.
3. **Start Coding:** Create a new file with the `.tezz` or `.tz` extension. VS Code will instantly recognize it, display the official Tezz icon, and activate syntax highlighting and real-time diagnostics!

## 📚 Example Code

### English Syntax
```tezz
service HelloAPI on 3000 {
  route GET "/hello/:name" {
    let name = params.name
    respond 200 { 
      message: "Hello, {name}!",
      powered_by: "Tezz"
    }
  }
}
```

### Hinglish Syntax
```tezz
seva HelloAPI on 3000 {
  rasta GET "/hello/:name" {
    mano name = params.name
    jawab 200 { 
      message: "Namaste, {name}!",
      powered_by: "Tezz"
    }
  }
}
```

## 🌟 Advanced Features

### Object-Oriented Programming
```tezz
class Animal {
  constructor(name) {
    this.name = name
  }
  
  speak() {
    print(this.name + " makes a sound")
  }
}

class Dog extends Animal {
  speak() {
    print(this.name + " barks: Woof!")
  }
}
```

### Concurrency with Spawn
```tezz
service AsyncAPI on 8080 {
  route POST "/process" {
    spawn {
      -- Runs in a separate worker thread
      print("Heavy processing in background!")
    }
    respond 202 { status: "processing" }
  }
}
```

### Enums and Traits
```tezz
enum Status {
  PENDING,
  ACTIVE,
  COMPLETED
}

trait Serializable {
  fn toJSON()
  fn fromJSON(data)
}
```

### Macros
```tezz
macro log_time(message) {
  print("[" + Date.now() + "] " + message)
}

log_time!("Server started")
```

## 📦 Core Ecosystem Support
Provides autocomplete and LSP hooks for modern backend paradigms:
- Zero-config CORS and regex routing
- Built-in SQL database connections (Turso, PostgreSQL, SQLite)
- Implicit async/await unwrapping
- Worker threads with `spawn`
- LLM integration with `tezz:llm`
- Authentication with `tezz:auth`
- File uploads with `tezz:upload`

## 🔗 Links
- **Documentation:** [tezz.abhinavkumarsingh.tech](https://tezz.abhinavkumarsingh.tech)
- **GitHub:** [github.com/abhinav29102005/tezz-lang](https://github.com/abhinav29102005/tezz-lang)
- **NPM:** [npmjs.com/package/tezz-lang](https://www.npmjs.com/package/tezz-lang)

## 🐛 Issues & Feedback
Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/abhinav29102005/tezz-lang/issues).

## 🛡 License
© 2026 Abhinav. All Rights Reserved. Licensed under the MIT License.

---

**Made with ❤️ and तेज़ी (speed) by [Abhinav](https://abhinavkumarsingh.tech)**

const fs = require("fs");
const path = require("path");

const baseUrl = "https://tezz.abhinavkumarsingh.tech";
const lastmod = "2026-09-22";

const baseCss = `
  :root {
    --bg: #0d1117;
    --text: #c9d1d9;
    --heading: #f0f6fc;
    --accent: #00f2fe;
    --accent-hover: #4facfe;
    --card-bg: #161b22;
    --border: #30363d;
    --code-bg: #1f242c;
  }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: var(--text);
    background-color: var(--bg);
    margin: 0;
    padding: 0;
  }
  header {
    background: #161b22;
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .brand {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent);
    text-decoration: none;
  }
  nav { display: flex; gap: 1rem; flex-wrap: wrap; }
  nav a {
    color: var(--text);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }
  nav a:hover, nav a.active { color: var(--accent); }
  .container { max-width: 900px; margin: 2rem auto; padding: 0 1.5rem; }
  h1 { color: var(--heading); font-size: 2.4rem; margin-top: 0; }
  h2 { color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-top: 2rem; }
  h3 { color: var(--heading); margin-top: 1.5rem; }
  code { background: var(--code-bg); color: #79c0ff; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.95em; }
  pre { background: #090d13; border: 1px solid var(--border); padding: 1rem; border-radius: 8px; overflow-x: auto; color: #e6edf3; }
  pre code { background: none; color: inherit; padding: 0; }
  .table-wrap { overflow-x: auto; margin: 1.5rem 0; }
  table { width: 100%; border-collapse: collapse; background: var(--card-bg); border-radius: 8px; overflow: hidden; }
  th, td { padding: 0.75rem 1rem; border: 1px solid var(--border); text-align: left; }
  th { background: #21262d; color: var(--heading); font-weight: 600; }
  .btn {
    display: inline-block;
    background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
    color: #0d1117;
    font-weight: bold;
    padding: 0.7rem 1.4rem;
    border-radius: 6px;
    text-decoration: none;
    margin: 0.4rem 0.4rem 0.4rem 0;
    transition: opacity 0.2s;
  }
  .btn:hover { opacity: 0.9; }
  footer {
    border-top: 1px solid var(--border);
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
    font-size: 0.9rem;
    color: #8b949e;
  }
  footer a { color: var(--accent); text-decoration: none; }
`;

function layout(title, description, canonicalPath, content, schemaJson) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${baseUrl}/${canonicalPath}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${baseUrl}/${canonicalPath}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Tezz Programming Language">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="keywords" content="tezz, tezz-lang, programming language, compiler, transpiler, edge, cloudflare workers, nodejs, bun, esolang, hinglish, vscode, javascript, rust, speed, devops">
  <meta name="robots" content="index, follow">
  <script type="application/ld+json">
  ${JSON.stringify(schemaJson, null, 2)}
  </script>
  <style>${baseCss}</style>
</head>
<body>
  <header>
    <a href="/" class="brand">⚡ Tezz (तेज़)</a>
    <nav>
      <a href="/">Home</a>
      <a href="/docs/">Docs</a>
      <a href="/keywords/">Keywords</a>
      <a href="/hinglish/">Hinglish</a>
      <a href="/services/">Services</a>
      <a href="/cli/">CLI</a>
      <a href="/vscode/">VS Code</a>
      <a href="/esolang/">Esolang</a>
    </nav>
  </header>
  <div class="container">
    ${content}
  </div>
  <footer>
    <p>Tezz Language (तेज़) • Built for zero-overhead edge performance by <a href="https://github.com/abhinav29102005" target="_blank" rel="noopener">Abhinav Kumar Singh</a>.</p>
    <p><a href="https://github.com/abhinav29102005/tezz-lang" target="_blank" rel="noopener">GitHub</a> | <a href="https://www.npmjs.com/package/tezz-lang" target="_blank" rel="noopener">npm</a> | <a href="https://marketplace.visualstudio.com/items?itemName=abhinav29102005.tezz" target="_blank" rel="noopener">VS Code Marketplace</a> | <a href="/sitemap.xml">Sitemap</a></p>
  </footer>
</body>
</html>`;
}

// 1. Docs page
const docsContent = `
  <h1>Tezz (तेज़) Documentation</h1>
  <p>Welcome to the official developer documentation for <strong>Tezz (tezz-lang)</strong>. Tezz is a fast, statically transpiled, edge-first programming language designed to run with zero overhead on modern JavaScript runtimes including <strong>Node.js, Cloudflare Workers, and Bun</strong>.</p>
  
  <h2>Installation</h2>
  <pre><code># Install Tezz CLI globally via npm
npm install -g tezz-lang

# Verify installation
tezz --version</code></pre>

  <h2>Quickstart Tutorial</h2>
  <p>Create a file named <code>hello.tezz</code>:</p>
  <pre><code>let name = "Tezz Developer"
print "Namaste, " + name + "! Welcome to Tezz."

service Echo on 3000 {
  route GET "/" {
    respond 200 { status: "OK", speed: "blazing" }
  }
}</code></pre>

  <p>Run it instantly with the Tezz runner:</p>
  <pre><code>tezz run hello.tezz</code></pre>

  <h2>Language Characteristics</h2>
  <ul>
    <li><strong>Dual Syntax Support:</strong> Write in standard English or expressive Hinglish directly in the same codebase.</li>
    <li><strong>Native Edge Services:</strong> First-class microservices with <code>service</code>, <code>route</code>, and <code>respond</code> primitives.</li>
    <li><strong>Zero Runtime Overhead:</strong> Emits clean, idiomatic, and highly optimizable JavaScript.</li>
    <li><strong>Language Server Protocol (LSP):</strong> Comprehensive autocompletion, real-time diagnostics, and hover documentation.</li>
  </ul>
`;
fs.mkdirSync("docs/docs", { recursive: true });
fs.writeFileSync("docs/docs/index.html", layout(
  "Tezz Documentation | Getting Started, Installation & Quickstart Guide",
  "Comprehensive documentation for Tezz (tezz-lang). Learn how to install via npm, run .tezz files, structure backend projects, and deploy to edge platforms.",
  "docs/",
  docsContent,
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Tezz Language Documentation and Getting Started Guide",
    "author": { "@type": "Person", "name": "Abhinav Kumar Singh" },
    "publisher": { "@type": "Organization", "name": "Tezz Programming Language" }
  }
));

// 2. Keywords page
const keywordsContent = `
  <h1>Tezz Language Keyword & Syntax Reference</h1>
  <p>Explore the complete token and keyword dictionary supported natively by the Tezz compiler. Tezz supports standard English syntax as well as native Hinglish keywords.</p>
  
  <h2>Core English Keywords</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Keyword</th><th>Category</th><th>Description & Example</th></tr></thead>
      <tbody>
        <tr><td><code>service</code></td><td>Edge / Service</td><td>Defines a native HTTP microservice on a port or worker trigger.</td></tr>
        <tr><td><code>route</code></td><td>HTTP Routing</td><td>Defines an HTTP endpoint (GET, POST, PUT, DELETE, PATCH).</td></tr>
        <tr><td><code>respond</code></td><td>HTTP Response</td><td>Sends an HTTP response payload with status code.</td></tr>
        <tr><td><code>let</code> / <code>const</code></td><td>Variables</td><td>Declares mutable variables (let) and immutable constants (const).</td></tr>
        <tr><td><code>fn</code></td><td>Functions</td><td>Declares a first-class function with lexical scope.</td></tr>
        <tr><td><code>return</code></td><td>Control Flow</td><td>Returns a value from a function.</td></tr>
        <tr><td><code>print</code></td><td>I/O</td><td>Prints values to standard output or logging context.</td></tr>
        <tr><td><code>if</code> / <code>else</code></td><td>Conditionals</td><td>Branching conditional statements.</td></tr>
        <tr><td><code>while</code> / <code>for</code></td><td>Loops</td><td>Iteration and loop structures.</td></tr>
        <tr><td><code>class</code> / <code>extends</code></td><td>OOP</td><td>Object-oriented classes, inheritance, and constructors.</td></tr>
        <tr><td><code>try</code> / <code>catch</code> / <code>throw</code></td><td>Error Handling</td><td>Exception throwing and handling blocks.</td></tr>
        <tr><td><code>async</code> / <code>await</code></td><td>Asynchronous</td><td>Non-blocking asynchronous functions and promises.</td></tr>
        <tr><td><code>background</code> / <code>spawn</code></td><td>Concurrency</td><td>Spawns worker threads and background tasks for heavy computations.</td></tr>
      </tbody>
    </table>
  </div>
`;
fs.mkdirSync("docs/keywords", { recursive: true });
fs.writeFileSync("docs/keywords/index.html", layout(
  "Tezz Language Keywords & Syntax Reference | Complete Token Index",
  "Complete reference for all Tezz language keywords including service, route, respond, let, const, fn, class, async, await, spawn, background, and standard libraries.",
  "keywords/",
  keywordsContent,
  {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "Tezz Keywords & Syntax Reference",
    "description": "Complete reference of all keywords and tokens in Tezz."
  }
));

// 3. Hinglish page
const hinglishContent = `
  <h1>Hinglish Programming in Tezz (हिंग्लिश कोडिंग)</h1>
  <p>Tezz is one of the first production-capable programming languages featuring first-class, compiler-level support for <strong>Hinglish (Hindi-English colloquial fusion)</strong> syntax. Code naturally using everyday phrases!</p>
  
  <h2>Hinglish Keyword Dictionary</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Hinglish Keyword</th><th>English Equivalent</th><th>Usage Example</th></tr></thead>
      <tbody>
        <tr><td><code>rakho</code></td><td><code>let</code></td><td><code>rakho x = 10;</code></td></tr>
        <tr><td><code>agar</code></td><td><code>if</code></td><td><code>agar (x > 5) { dikha "Bada hai"; }</code></td></tr>
        <tr><td><code>warna</code></td><td><code>else</code></td><td><code>warna { dikha "Chhota hai"; }</code></td></tr>
        <tr><td><code>jabtak</code></td><td><code>while</code></td><td><code>jabtak (i < 5) { i = i + 1; }</code></td></tr>
        <tr><td><code>karya</code></td><td><code>fn</code></td><td><code>karya jodo(a, b) { wapas a + b; }</code></td></tr>
        <tr><td><code>wapas</code></td><td><code>return</code></td><td><code>wapas result;</code></td></tr>
        <tr><td><code>dikha</code></td><td><code>print</code></td><td><code>dikha "Namaste Tezz!";</code></td></tr>
        <tr><td><code>dhancha</code></td><td><code>class</code></td><td><code>dhancha Khata { ... }</code></td></tr>
        <tr><td><code>se_bana</code></td><td><code>extends</code></td><td><code>dhancha Bachha se_bana Baap { ... }</code></td></tr>
        <tr><td><code>naya</code></td><td><code>new</code></td><td><code>rakho k = naya Khata();</code></td></tr>
        <tr><td><code>yeh</code></td><td><code>this</code></td><td><code>yeh.naam = naam;</code></td></tr>
        <tr><td><code>koshish</code></td><td><code>try</code></td><td><code>koshish { ... } pakad (err) { ... }</code></td></tr>
        <tr><td><code>pakad</code></td><td><code>catch</code></td><td><code>pakad (error) { dikha error; }</code></td></tr>
        <tr><td><code>ruko</code></td><td><code>await</code></td><td><code>rakho res = ruko fetch(url);</code></td></tr>
        <tr><td><code>baadmein</code></td><td><code>async</code></td><td><code>baadmein karya getInfo() { ... }</code></td></tr>
        <tr><td><code>lao</code> / <code>se</code></td><td><code>import</code> / <code>from</code></td><td><code>lao { Math } se "std";</code></td></tr>
      </tbody>
    </table>
  </div>
`;
fs.mkdirSync("docs/hinglish", { recursive: true });
fs.writeFileSync("docs/hinglish/index.html", layout(
  "Hinglish Programming in Tezz | Hindi-English Coding Syntax (रखो, अगर, कार्य)",
  "Write code in Hinglish with Tezz! Native compiler keywords: rakho, agar, warna, jabtak, karya, wapas, dikha, dhancha, naya, koshish, pakad, and ruko.",
  "hinglish/",
  hinglishContent,
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Hinglish Programming Language Syntax in Tezz",
    "keywords": "hinglish coding, hindi programming language, tezz rakho agar warna"
  }
));

// 4. Services page
const servicesContent = `
  <h1>Edge Microservices & Native HTTP Routing in Tezz</h1>
  <p>Tezz makes developing backend microservices effortless. Instead of importing bulky frameworks or handling boilerplate HTTP server listeners, Tezz treats services and routes as first-class language keywords.</p>

  <h2>Microservice Example</h2>
  <pre><code>service UserAPI on 8080 {
  route GET "/users" {
    respond 200 { users: ["Aks", "Tezz"] }
  }

  route POST "/users" {
    let payload = request.body
    respond 201 { status: "created", data: payload }
  }
}</code></pre>
`;
fs.mkdirSync("docs/services", { recursive: true });
fs.writeFileSync("docs/services/index.html", layout(
  "Edge Microservices & Native HTTP Routing in Tezz",
  "Build ultra-fast HTTP microservices with native service, route, and respond keywords in Tezz. Zero boilerplate for Cloudflare Workers and Node.js.",
  "services/",
  servicesContent,
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Native Edge Microservices and HTTP Routing in Tezz"
  }
));

// 5. CLI page
const cliContent = `
  <h1>Tezz CLI Tooling Reference</h1>
  <p>The <code>tezz</code> command-line interface provides everything you need to run, compile, format, and test your code.</p>

  <h2>Core Commands</h2>
  <pre><code># Run a .tezz file directly
tezz run app.tezz

# Build and compile .tezz into optimized JavaScript
tezz build app.tezz --out dist/app.js

# Launch the interactive REPL
tezz repl

# Run automated test suites
tezz test</code></pre>
`;
fs.mkdirSync("docs/cli", { recursive: true });
fs.writeFileSync("docs/cli/index.html", layout(
  "Tezz CLI Reference | tezz run, tezz build, tezz test & REPL",
  "Command line interface (CLI) guide for tezz-lang. Complete command documentation for running files, transpiling to JavaScript, running tests, and interactive REPL.",
  "cli/",
  cliContent,
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Tezz CLI Tooling and Command Reference"
  }
));

// 6. VS Code page
const vscodeContent = `
  <h1>Official Tezz VS Code Extension & Language Server</h1>
  <p>The official Tezz extension provides a full-featured Language Server Protocol (LSP) implementation, delivering an IDE experience on par with TypeScript, Rust, and Go.</p>

  <h2>Features</h2>
  <ul>
    <li><strong>Real-time Diagnostics:</strong> Highlights syntax errors and warnings as you type.</li>
    <li><strong>Smart Autocompletion:</strong> Instant code completions for both English and Hinglish keywords.</li>
    <li><strong>Hover Documentation:</strong> Hover over any keyword or token to view syntax details and examples.</li>
    <li><strong>Semantic Syntax Highlighting:</strong> Vivid token differentiation tailored for .tezz files.</li>
  </ul>

  <p>
    <a href="https://marketplace.visualstudio.com/items?itemName=abhinav29102005.tezz" class="btn" target="_blank" rel="noopener">Install from VS Code Marketplace</a>
    <a href="https://open-vsx.org/extension/abhinav29102005/tezz" class="btn" target="_blank" rel="noopener">Install on Open VSX</a>
  </p>
`;
fs.mkdirSync("docs/vscode", { recursive: true });
fs.writeFileSync("docs/vscode/index.html", layout(
  "Tezz VS Code Extension & Language Server (LSP) Guide",
  "Official Visual Studio Code extension for Tezz language. Real-time diagnostics, syntax highlighting, autocompletion, and hover documentation for English & Hinglish keywords.",
  "vscode/",
  vscodeContent,
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Tezz Language Extension for Visual Studio Code",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All"
  }
));

// 7. Esolang page
const esolangContent = `
  <h1>Tezz Esolang Specifications & Runtime Benchmarks</h1>
  <p>Tezz was built to demonstrate that expressive, non-traditional syntax (including Hinglish and native service routing) does not require sacrificing performance.</p>

  <h2>Benchmark Metrics</h2>
  <ul>
    <li><strong>Startup Time:</strong> Under 15ms on modern V8 engines.</li>
    <li><strong>Memory Footprint:</strong> Minimal overhead over raw Node.js/Bun execution.</li>
    <li><strong>Compilation Latency:</strong> Sub-second single-pass AST tokenizer and emitter.</li>
  </ul>
`;
fs.mkdirSync("docs/esolang", { recursive: true });
fs.writeFileSync("docs/esolang/index.html", layout(
  "Tezz Esolang & Performance Benchmarks | Fast Edge Architecture",
  "Esolang specifications and runtime benchmarks for Tezz. High-performance AST generation, minimal memory footprint, and zero-overhead execution.",
  "esolang/",
  esolangContent,
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Tezz Esolang Specifications and Architecture"
  }
));

// 8. Update docs/index.html
const homeContent = `
  <div style="text-align: center; margin: 3rem 0 4rem 0;">
    <h1 style="font-size: 3.2rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">⚡ Tezz (तेज़)</h1>
    <p style="font-size: 1.3rem; color: #8b949e; max-width: 650px; margin: 0 auto 2rem auto;">The fast, zero-overhead edge programming language compiling directly to optimized JavaScript.</p>
    <div>
      <a href="/docs/" class="btn">Get Started</a>
      <a href="/keywords/" class="btn">Keywords Reference</a>
      <a href="/hinglish/" class="btn">Hinglish Guide</a>
      <a href="https://github.com/abhinav29102005/tezz-lang" class="btn" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>

  <h2>Why Developers Choose Tezz</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
    <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
      <h3 style="margin-top: 0; color: var(--accent);">⚡ Zero Runtime Overhead</h3>
      <p>Tezz compiles down to clean JavaScript that takes maximum advantage of V8 optimization pipelines in Node.js, Cloudflare Workers, and Bun.</p>
    </div>
    <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
      <h3 style="margin-top: 0; color: var(--accent);">🌐 Native Microservices</h3>
      <p>Spin up fast HTTP APIs without third-party boilerplate using first-class <code>service</code>, <code>route</code>, and <code>respond</code> primitives.</p>
    </div>
    <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
      <h3 style="margin-top: 0; color: var(--accent);">🇮🇳 Dual English & Hinglish</h3>
      <p>Switch seamlessly between standard English syntax and expressive Hinglish keywords (<code>rakho</code>, <code>agar</code>, <code>karya</code>, <code>dikha</code>).</p>
    </div>
    <div style="background: var(--card-bg); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
      <h3 style="margin-top: 0; color: var(--accent);">🛠️ First-Class Tooling</h3>
      <p>Integrated language server (LSP) and official VS Code extension providing autocompletions, hover docs, and diagnostics.</p>
    </div>
  </div>

  <h2>Quickstart in 60 Seconds</h2>
  <pre><code># Install globally via npm
npm install -g tezz-lang

# Run any .tezz file
tezz run app.tezz</code></pre>

  <h2>Explore Tezz</h2>
  <ul>
    <li><a href="/docs/"><strong>Getting Started Documentation</strong></a>: Installation, CLI, and project setup.</li>
    <li><a href="/keywords/"><strong>Keyword Reference</strong></a>: All English and Hinglish language keywords.</li>
    <li><a href="/hinglish/"><strong>Hinglish Guide</strong></a>: Learn how to program using Hinglish syntax.</li>
    <li><a href="/services/"><strong>Edge Microservices</strong></a>: Native HTTP server routing.</li>
    <li><a href="/cli/"><strong>CLI Commands</strong></a>: <code>tezz run</code>, <code>tezz build</code>, <code>tezz repl</code>.</li>
    <li><a href="/vscode/"><strong>VS Code Extension</strong></a>: Editor support and LSP.</li>
  </ul>
`;

fs.writeFileSync("docs/index.html", layout(
  "Tezz (तेज़) | The Fast Edge Programming Language & Compiler",
  "Tezz-lang is a zero-overhead, highly optimized backend programming language compiling to JavaScript. Native support for English and Hinglish syntaxes. Built for Node.js, Cloudflare Workers, and Bun.",
  "",
  homeContent,
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Tezz Programming Language",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Cross-platform",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Abhinav Kumar Singh",
      "url": "https://abhinavkumarsingh.tech"
    }
  }
));

console.log("Successfully generated all SEO documentation pages!");

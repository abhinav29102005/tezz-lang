const fs = require('fs');
const path = require('path');

const pages = [
  {
    slug: 'comparisons',
    group: 'Comparisons',
    title: 'Tezz vs Others',
    toc: [
      { id: 'comparisons', text: 'Tezz vs Others' },
      { id: 'nodejs', text: 'Node.js / Express' },
      { id: 'python', text: 'Python / FastAPI' },
      { id: 'go', text: 'Go (Golang)' },
      { id: 'rust', text: 'Rust / Actix' }
    ],
    content: `
      <h1 id="comparisons">Tezz vs Other Frameworks</h1>
      <p>Tezz is designed to bring the speed of compiled languages with the ease of JavaScript and Python. Here is how Tezz compares with other popular backend ecosystems.</p>

      <h2 id="nodejs">Node.js (Express / Fastify)</h2>
      <p>While Tezz compiles to JavaScript (for Cloudflare Workers or Node environments), the source language eliminates the boilerplate of Express.js.</p>
      <ul>
        <li><strong>Setup:</strong> Node requires <code>package.json</code>, npm installs, and complex setups. Tezz is zero-config.</li>
        <li><strong>Routing:</strong> Tezz has built-in declarative routing via the <code>service</code> block.</li>
        <li><strong>Speed:</strong> Tezz compiles directly into native Fetch API / Worker formats, bypassing heavy middleware layers.</li>
      </ul>

      <h2 id="python">Python (FastAPI / Django)</h2>
      <p>Python is loved for its simplicity, but it struggles with asynchronous performance and deployment complexity (WSGI/ASGI).</p>
      <ul>
        <li><strong>Syntax:</strong> Tezz offers a Python-like clean syntax but adds strict safety.</li>
        <li><strong>Performance:</strong> Tezz is significantly faster than Python because it compiles to V8 optimized JavaScript rather than interpreted Python bytecode.</li>
        <li><strong>Deployment:</strong> Deploying Python requires Gunicorn/Uvicorn and Docker. Tezz deploys to edge networks (Cloudflare) in 1 second.</li>
      </ul>

      <h2 id="go">Go (Golang)</h2>
      <p>Go is the king of backend performance and concurrency. Tezz aims to be the "Go for the Edge".</p>
      <ul>
        <li><strong>Learning Curve:</strong> Go requires understanding pointers, goroutines, and strict typing. Tezz is as easy to learn as JavaScript.</li>
        <li><strong>Cold Starts:</strong> Go binaries can be large. Tezz compiles to tiny JS bundles with 0ms cold starts on the Edge.</li>
        <li><strong>Ecosystem:</strong> Go has a rich standard library. Tezz relies on the massive npm ecosystem under the hood.</li>
      </ul>

      <h2 id="rust">Rust (Actix / Axum)</h2>
      <p>Rust offers unparalleled memory safety and speed, but at the cost of a notoriously steep learning curve.</p>
      <ul>
        <li><strong>Development Speed:</strong> Writing a Rust backend takes time due to the borrow checker. Tezz lets you prototype and ship in minutes.</li>
        <li><strong>Safety:</strong> Rust guarantees memory safety at compile time. Tezz relies on the V8 engine's garbage collector.</li>
        <li><strong>Use Case:</strong> Use Rust for OS-level systems and CPU-heavy tasks. Use Tezz for blazing fast web APIs and microservices.</li>
      </ul>
    `
  },
  {
    slug: 'introduction',
    group: 'Getting Started',
    title: 'Introduction',
    toc: [{ id: 'introduction', text: 'Introduction' }, { id: 'why-tezz', text: 'Why Tezz?' }],
    content: `
      <h1 id="introduction">Introduction</h1>
      <p>Tezz is a blazing fast backend programming language that compiles directly into highly optimized JavaScript.</p>
      <h2 id="why-tezz">Why Tezz?</h2>
      <p>Most backend frameworks require massive configuration... Tezz gives you zero config by default.</p>
    `
  },
  {
    slug: 'installation-and-cli',
    group: 'Getting Started',
    title: 'Installation & CLI',
    toc: [{ id: 'installation-and-cli', text: 'Installation' }, { id: 'cli-commands', text: 'CLI Commands' }],
    content: `
      <h1 id="installation-and-cli">Installation & CLI</h1>
      <p>Install Tezz globally using npm:</p>
      <pre><code>npm install -g tezz-lang</code></pre>
      <h2 id="cli-commands">CLI Commands</h2>
      <ul>
        <li><code>tezz run app.tezz</code> - Runs your server locally with hot-reloading.</li>
        <li><code>tezz build app.tezz</code> - Compiles to production-ready JS.</li>
        <li><code>tezz deploy app.tezz</code> - Deploys straight to Cloudflare Workers.</li>
      </ul>
    `
  },
  {
    slug: 'syntax',
    group: 'Core Language',
    title: 'Language Syntax',
    toc: [
      { id: 'syntax', text: 'Language Syntax' },
      { id: 'variables', text: 'Variables' },
      { id: 'functions', text: 'Functions' }
    ],
    content: `
      <h1 id="syntax">Language Syntax</h1>
      <p>Tezz syntax is designed to be instantly familiar if you know JavaScript or TypeScript.</p>
      <h2 id="variables">Variables</h2>
      <pre><code>let name = "Tezz"
let port = 8080
let users = ["Alice", "Bob"]
let config = { debug: true, version: "1.0" }</code></pre>
      <h2 id="functions">Functions</h2>
      <pre><code>fn greet(name: string) -> string {
  return "Hello, {name}!"
}</code></pre>
    `
  },
  {
    slug: 'hinglish',
    group: 'Core Language',
    title: 'Hinglish Support',
    toc: [
      { id: 'hinglish-support', text: 'Hinglish Support' },
      { id: 'keywords-map', text: 'Keywords Map' },
      { id: 'example', text: 'Example' }
    ],
    content: `
      <h1 id="hinglish-support">Hinglish Support</h1>
      <p>Tezz allows you to write backend code in Hinglish. Keywords map exactly 1:1 with English.</p>
      <h2 id="keywords-map">Keywords Map</h2>
      <table>
        <thead><tr><th>English</th><th>Hinglish</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>let</code></td><td><code>rakho</code></td><td>Keep / Declare</td></tr>
          <tr><td><code>fn</code></td><td><code>kaam</code></td><td>Work / Function</td></tr>
          <tr><td><code>if</code></td><td><code>agar</code></td><td>If</td></tr>
          <tr><td><code>else</code></td><td><code>warna</code></td><td>Else / Otherwise</td></tr>
          <tr><td><code>return</code></td><td><code>vapas</code></td><td>Return / Give back</td></tr>
          <tr><td><code>print</code></td><td><code>dikha</code></td><td>Show / Print</td></tr>
          <tr><td><code>route</code></td><td><code>rasta</code></td><td>Path / Route</td></tr>
          <tr><td><code>service</code></td><td><code>seva</code></td><td>Service</td></tr>
          <tr><td><code>respond</code></td><td><code>jawab</code></td><td>Reply / Respond</td></tr>
          <tr><td><code>true</code></td><td><code>sahi</code></td><td>Right / True</td></tr>
          <tr><td><code>false</code></td><td><code>galat</code></td><td>Wrong / False</td></tr>
        </tbody>
      </table>

      <h2 id="example">Example: A Pure Hinglish API</h2>
      <pre><code>pakka version = "0.2.0"

kaam generateGreeting(name) {
  agar name == "Abhinav" {
    vapas "Namaste Creator! "
  } warna {
    vapas "Namaste, {name}! "
  }
}

seva HinglishAPI on 3000 {
  rasta GET "/" {
    rakho user = request.query.name || "Duniya"
    dikha("Request from: " + user)
    jawab 200 { 
      message: generateGreeting(user),
      status: sahi
    }
  }
}</code></pre>
    `
  },
  {
    slug: 'services-and-routes',
    group: 'Backend APIs',
    title: 'Services & Routes',
    toc: [
      { id: 'services-routes-header', text: 'Services & Routes' },
      { id: 'service-block', text: 'The Service Block' },
      { id: 'routing', text: 'Routing' },
      { id: 'path-parameters', text: 'Path Parameters' },
      { id: 'request-object', text: 'Request Object' },
      { id: 'sending-responses', text: 'Sending Responses' }
    ],
    content: `
      <h1 id="services-routes-header">Services & Routes</h1>
      <p>Tezz abstracts away HTTP server boilerplate.</p>
      <h2 id="service-block">The Service Block</h2>
      <pre><code>service UserAPI on 8080 {
  // Routes go here
}</code></pre>

      <h2 id="routing">Routing</h2>
      <pre><code>route GET "/users" { }
route POST "/users" { }</code></pre>

      <h2 id="path-parameters">Dynamic Path Parameters</h2>
      <pre><code>route GET "/users/:id" {
  let userId = params.id
}</code></pre>

      <h2 id="request-object">The Request Object</h2>
      <ul>
        <li><code>request.method</code> - HTTP method</li>
        <li><code>request.url</code> - URL path</li>
        <li><code>request.query</code> - Query params</li>
        <li><code>request.json()</code> - JSON body</li>
      </ul>

      <h2 id="sending-responses">Sending Responses</h2>
      <pre><code>route POST "/login" {
  respond 200 { success: true }
}</code></pre>
    `
  },
  {
    slug: 'deployment',
    group: 'Backend APIs',
    title: 'Deployment Guide',
    toc: [
      { id: 'deployment-header', text: 'Deployment' },
      { id: 'nodejs', text: 'Deploying to Node.js' },
      { id: 'cloudflare-workers', text: 'Deploying to Cloudflare' },
      { id: 'why-target', text: 'Why Target-Based Compilation?' }
    ],
    content: `
      <h1 id="deployment-header">Deployment Guide</h1>
      <h2 id="nodejs">Deploying to Node.js (Default)</h2>
      <pre><code>tezz build app.tezz --target node --output dist/server.js
node dist/server.js</code></pre>

      <h2 id="cloudflare-workers">Deploying to Cloudflare Workers</h2>
      <pre><code>tezz deploy app.tezz --name my-super-fast-api</code></pre>

      <h2 id="why-target">Why Target-Based Compilation?</h2>
      <p>Your source code never changes. If you target node, the codegen outputs http.createServer. If you target worker, it outputs an export default { fetch() } object.</p>
    `
  },
  {
    slug: 'ecosystem',
    group: 'Ecosystem',
    title: 'Standard Libraries',
    toc: [
      { id: 'ecosystem-header', text: 'Ecosystem Packages' },

      { id: 'tezz-database', text: 'tezz-database' },
      { id: 'tezz-jwt', text: 'tezz-jwt' }
    ],
    content: `
      <h1 id="ecosystem-header">Standard Libraries</h1>
      <h2 id="tezz-database">tezz-database</h2>
      <pre><code>npm install tezz-database</code></pre>
      <pre><code>import createClient from "tezz-database"
let db = createClient({ url: "YOUR_TURSO_URL", token: "YOUR_TOKEN" })
let result = await db.execute("SELECT * FROM users")</code></pre>

      <h2 id="tezz-jwt">tezz-jwt</h2>
      <pre><code>npm install tezz-jwt</code></pre>
      <pre><code>import { sign, verify } from "tezz-jwt"
let token = sign({ user: "abhinav" }, "secret-key")</code></pre>
    `
  },
  {
    slug: 'roadmap',
    group: 'Ecosystem',
    title: 'Limitations & Roadmap',
    toc: [
      { id: 'limitations', text: 'What Tezz Lacks' },
      { id: 'python-fastapi', text: 'Compared to Python / FastAPI' },
      { id: 'nodejs-express', text: 'Compared to Node.js / Express' },
      { id: 'go', text: 'Compared to Go' },
      { id: 'rust', text: 'Compared to Rust' },
      { id: 'contribute', text: 'How to Contribute' }
    ],
    content: `
      <h1 id="limitations">What Tezz Lacks (Limitations & Roadmap)</h1>
      <p>Tezz is a new, lightweight, blazing-fast language, but it is currently missing several robust features and libraries found in mature ecosystems. Here is a transparent look at what we currently lack, and the roadmap of libraries we plan to add.</p>

      <h2 id="python-fastapi">1. Compared to Python (FastAPI)</h2>
      <p>FastAPI has set the gold standard for developer experience in Python. Currently, Tezz lacks:</p>
      <ul>
        <li><strong>Auto-Generated Docs:</strong> FastAPI automatically builds Swagger UI / OpenAPI docs from your code. Tezz needs a <code>tezz-openapi</code> library to auto-generate docs from route signatures.</li>
        <li><strong>Strict Data Validation:</strong> FastAPI uses Pydantic. Tezz needs a <code>tezz-validator</code> standard library to statically type and validate incoming JSON request bodies.</li>
        <li><strong>Background Tasks:</strong> Built-in decorators for background tasks are missing.</li>
      </ul>

      <h2 id="nodejs-express">2. Compared to Node.js (Express)</h2>
      <p>Because Tezz compiles to JavaScript, you can technically use npm packages, but we lack native Tezz standard libraries for:</p>
      <ul>
        <li><strong>Authentication:</strong> Node has Passport.js. We need a native <code>tezz-auth</code> package that handles OAuth, Sessions, and JWT elegantly.</li>
        <li><strong>File Uploads:</strong> Node has Multer. Tezz needs a <code>tezz-upload</code> library to easily parse multi-part form data and handle file streaming.</li>
        <li><strong>WebSockets:</strong> While Cloudflare Workers support WebSockets, Tezz currently lacks native syntax sugar for WebSocket routing.</li>
      </ul>

      <h2 id="go">3. Compared to Go (Golang)</h2>
      <p>Go is famous for its performance and concurrency model. Tezz lacks:</p>
      <ul>
        <li><strong>Goroutines & Channels:</strong> Tezz runs on the V8 engine (single-threaded event loop). It lacks true OS-level multithreading primitives like Go's channels.</li>
        <li><strong>Static Binaries:</strong> Go compiles down to a single machine-code binary. Tezz currently compiles to JS, meaning it relies on a JS runtime (Node, Deno, Bun, or Cloudflare) to execute.</li>
      </ul>

      <h2 id="rust">4. Compared to Rust</h2>
      <p>Rust provides unmatched memory safety and advanced type systems.</p>
      <ul>
        <li><strong>Advanced Type System:</strong> Rust has Traits, Enums with data, and Pattern Matching. Tezz's type system is currently very basic.</li>
        <li><strong>Macros:</strong> Rust's powerful macro system allows for deep metaprogramming. Tezz does not currently support macros.</li>
      </ul>

      <h2 id="contribute">How You Can Help</h2>
      <p>Tezz is open source! We are actively looking for contributors to build <code>tezz-openapi</code>, <code>tezz-auth</code>, and <code>tezz-validator</code>. If you are interested in extending the compiler or building a standard library, check out our GitHub repository.</p>
    `
  }
];

// Group the pages by their "group" property for the sidebar
const groups = {};
pages.forEach(page => {
  if (!groups[page.group]) groups[page.group] = [];
  groups[page.group].push(page);
});

// Build Sidebar HTML function
function buildSidebar(currentSlug) {
  let content = '';
  for (const [groupName, groupPages] of Object.entries(groups)) {
    content += '<div class="npm-nav-group">' + 
               '<h4>' + groupName + '</h4>' + 
               '<ul class="npm-nav-list">' + 
               groupPages.map(page => {
                 let activeClass = page.slug === currentSlug ? 'class="active"' : '';
                 return '<li><a href="/docs/' + page.slug + '.html" ' + activeClass + '>' + page.title + '</a></li>';
               }).join('') + 
               '</ul></div>';
  }
  return content;
}

const outDir = path.join('website', 'docs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Use index.html as the layout template! This unifies everything.
const indexPath = path.join('website', 'index.html');
let templateHTML = fs.readFileSync(indexPath, 'utf-8');

pages.forEach(page => {
  let pageContent = '<section id="' + page.slug + '" class="doc-section">' + page.content + '</section>';
  let pageSidebar = buildSidebar(page.slug);
  
  let docsHTML = `
    <div class="npm-subheader">
      <div class="npm-subheader-title">Tezz Documentation</div>
    </div>
    <div class="npm-container">
      <aside class="npm-sidebar">
        ${pageSidebar}
      </aside>
      <main class="npm-main">
        ${pageContent}
      </main>
      <aside class="npm-toc">
        <h4>In this article</h4>
        <ul>
          ${page.toc.map(item => '<li><a href="#' + item.id + '">' + item.text + '</a></li>').join('')}
        </ul>
      </aside>
    </div>
  `;
  
  // Replace the home-view with our docs HTML
  let startIdx = templateHTML.indexOf('<main id="home-view"');
  let endIdx = templateHTML.indexOf('</main>', startIdx) + 7;
  
  let resultHTML = templateHTML.substring(0, startIdx) + '\n' + docsHTML + '\n' + templateHTML.substring(endIdx);
  
  // Update Title
  resultHTML = resultHTML.replace('<title>⚡ Tezz | The Blazing Fast Backend Language</title>', '<title>' + page.title + ' | Tezz Docs</title>');
  
  let filePath = path.join(outDir, page.slug + '.html');
  fs.writeFileSync(filePath, resultHTML);
  console.log('Created ' + filePath);
});

// Redirect index
fs.writeFileSync(path.join(outDir, 'index.html'), '<meta http-equiv="refresh" content="0; url=/docs/introduction.html" />');
console.log('Created index redirect');

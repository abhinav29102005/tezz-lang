const fs = require('fs');
const path = require('path');

const pages = [

  {
    slug: 'advanced-types',
    group: 'Advanced Features',
    title: 'Types & Enums',
    toc: [
      { id: 'enums', text: 'Enums (vikalp)' },
      { id: 'traits', text: 'Traits (lakshan)' }
    ],
    content: `
      <h1 id="enums">Advanced Types</h1>
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/2s4-1Q_kLNgAAAAd/dekh-raha-hai-binod-panchayat.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
      <p>Tezz natively supports Rust-like Enums and Traits which compile directly into zero-overhead JS equivalents.</p>
      <pre><code>enum Status {
  PENDING,
  ACTIVE,
  DELETED
}
// Compiles to Object.freeze({ ... })</code></pre>

      <h2 id="traits">Traits</h2>
      <p>Define interfaces for compile-time structure verification.</p>
      <pre><code>trait UserProvider {
  fn getUser(id)
  fn saveUser(user)
}</code></pre>
    `
  },
  {
    slug: 'macros',
    group: 'Advanced Features',
    title: 'Macros (jadoo)',
    toc: [
      { id: 'macros', text: 'Compile-Time Macros' }
    ],
    content: `
      <h1 id="macros">Deep Metaprogramming with Macros</h1>
      <div style="text-align:center; margin: 2rem 0;"><img src="/docs/jadoo.png" style="max-width:400px; border-radius: 8px;"/></div>
      
      <p>Tezz allows you to write Rust-like macros that manipulate the AST at compile time for zero-overhead execution.</p>
      <pre><code>macro log_status(status) {
  print("Status:")
  print(status)
}

// Expands safely into an IIFE at compile time
log_status!(Status.ACTIVE)</code></pre>
    `
  },
  {
    slug: 'concurrency',
    group: 'Advanced Features',
    title: 'Goroutines (spawn)',
    toc: [
      { id: 'spawn', text: 'OS-Level Concurrency' }
    ],
    content: `
      <h1 id="spawn">Parallelism with spawn</h1>
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/L4R-_Z4rY88AAAAC/akshay-kumar-21-din-mein-paisa-double.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
      <p>Tezz automatically compiles <code>spawn</code> blocks into <code>worker_threads</code> in Node.js, and background isolates in Cloudflare Workers!</p>
      <pre><code>spawn {
  print("Calculating prime numbers in parallel!")
}</code></pre>
    `
  },

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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/4F5wWd4h9XgAAAAd/kya-gunda-banega-re-tu-baburao-ganpatrao-apte.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/CkbhWfeHt0AAAAAd/abhi-maja-ayga-na-bhidu-hera-pheri.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/tZ2X5k0J7aAAAAAd/bade-aaram-se-chunky-pandey.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
      <p>Install Tezz globally using npm:</p>
      <pre><code>npm install -g tezz-lang</code></pre>
      <h2 id="cli-commands">CLI Commands</h2>
      <ul>
        <li><code>tezz run app.tezz</code> - Runs your server locally with hot-reloading.</li>
        <li><code>tezz build app.tezz</code> - Compiles to production-ready JS.</li>
        <li><code>tezz deploy app.tezz</code> - Deploys straight to Cloudflare Workers.</li>
      </ul>
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/bIHWOMefmHkAAAAd/hackerman.gif" style="max-width:400px; border-radius: 8px;"/></div>
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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/XwItyh36d5IAAAAd/baburao-utha-le.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/V7U5F-5m4F4AAAAd/samajh-rahe-ho-zakir-khan.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/N74uCqUo7aQAAAAd/dicaprio.gif" style="max-width:400px; border-radius: 8px;"/></div>

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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/e2s4R1Wb4gAAAAAd/hera-pheri-akshay-kumar.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/7p40PZONi2UAAAAd/paisa-hi-paisa-hoga-akshay-kumar.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
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
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/uR2gW7p4x9sAAAAd/ye-baburao-ka-style-hai-baburao.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
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
    title: 'Roadmap & Contributing',
    toc: [
      { id: 'roadmap', text: 'Roadmap' },
      { id: 'contribute', text: 'How to Contribute' }
    ],
    content: `
      <h1 id="roadmap">Roadmap & Future Goals</h1>
      <div style="text-align:center; margin: 2rem 0;"><img src="https://media.tenor.com/N7wD2J2uXfAAAAAd/jalwa-hai-hamara.gif" style="max-width:400px; border-radius: 8px;"/></div>
      
      <p>Tezz has rapidly grown from a simple transpiler into a robust ecosystem featuring advanced metaprogramming, OS-level concurrency, and native standard libraries.</p>
      
      <p>Our upcoming focus areas include:</p>
      <ul>
        <li><strong>Native Database Drivers:</strong> First-class integration for PostgreSQL and Redis with zero-overhead connection pooling.</li>
        <li><strong>Enhanced Type Inference:</strong> Smarter type resolution across complex trait boundaries.</li>
        <li><strong>WebSockets:</strong> First-class declarative syntax for WebSocket routing, similar to our HTTP <code>service</code> blocks.</li>
      </ul>

      <h2 id="contribute">How You Can Help Make Tezz Better</h2>
      <p>Tezz is completely open-source and community-driven! We are actively looking for contributors to help build new standard libraries, improve the compiler, and refine the ecosystem.</p>
      
      <p>Whether you want to add a new feature, fix a bug, or just improve documentation, your contributions are welcome!</p>
      
      <p>👉 <strong>Join us on GitHub:</strong> <a href="https://github.com/abhinav29102005/tezz-lang" target="_blank">https://github.com/abhinav29102005/tezz-lang</a></p>
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
  const order = ['Getting Started', 'Core Language', 'Backend APIs', 'Advanced Features', 'Ecosystem', 'Comparisons'];
  const orderedGroups = Object.keys(groups).sort((a, b) => {
    let ia = order.indexOf(a); let ib = order.indexOf(b);
    if(ia === -1) ia = 99; if(ib === -1) ib = 99;
    return ia - ib;
  });
  
  for (const groupName of orderedGroups) {
    const groupPages = groups[groupName];
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

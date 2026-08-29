with open('generate_docs.js', 'r') as f:
    gen = f.read()

# First, let's remove the broken injection. It starts with "\n\n  {\n    slug: 'roadmap'," and ends with "  },\n" right before "      { id: 'tezz-database', text: 'tezz-database' },".
import re

start_marker = "\n  {\n    slug: 'roadmap',"
end_marker = "    `\n  },\n"
start_idx = gen.find(start_marker)
end_idx = gen.find(end_marker, start_idx) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    gen = gen[:start_idx] + gen[end_idx:]
    print("Successfully removed broken injection.")
else:
    print("Could not find broken injection.")

# Now, inject it properly at the end of the pages array.
# The pages array ends with:
#     `
#   }
# ];
# 
# // Group the pages by their "group" property for the sidebar

inject_point = "  }\n];"
if inject_point in gen:
    new_page = """,
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
];"""
    gen = gen.replace(inject_point, new_page)
    print("Successfully injected new page.")
else:
    print("Could not find injection point.")

with open('generate_docs.js', 'w') as f:
    f.write(gen)

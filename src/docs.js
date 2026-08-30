function printDocs() {
  const docs = `
  ⚡ Tezz (तेज़) Language Documentation ⚡
  =======================================
  Tezz is a blazing fast, zero-overhead transpiled language for modern backends.
  It compiles down to raw, highly optimized JavaScript for Node.js or Cloudflare Workers.

  -- Core CLI Commands --
  tezz run <file.tezz>     : Compiles and executes a Tezz file immediately in Node.
  tezz dev <file.tezz>     : Runs a Tezz file in watch mode (auto-reload on changes).
  tezz build <file.tezz>   : Compiles a Tezz file to JavaScript (outputs to .tezz/build/).
                             Use --target worker for Cloudflare Workers (default is node).
  tezz init                : Initializes a new Tezz project with boilerplate.
  tezz deploy <file.tezz>  : Automatically builds and deploys to Cloudflare via Wrangler.
  tezz docs                : Displays this extensive documentation.

  -- 1. Variables & Types --
  Tezz supports both inferred and explicit typing.
     let name = "Abhinav"       // Inferred string
     let age: int = 18          // Explicit integer
     const pi: float = 3.14     // Constant float
     let is_active: bool = true // Boolean

  -- 2. Functions --
  Functions are defined with the 'fn' keyword.
     fn calculate_tax(amount: float, rate: float): float {
       return amount * rate
     }

  -- 3. Services & APIs --
  Tezz makes defining HTTP services incredibly easy. No Express.js boilerplate.
  CORS, JSON parsing, and response mapping are handled automatically.

     // Start an anonymous service on port 8787
     service on 8787 {
       GET "/api/hello" {
         // Auto-parses to JSON and responds with HTTP 200 OK
         return { message: "Hello World" }
       }
       
       POST "/api/data" {
         let body = request.json()  // Asynchronously parses request body
         
         if !body.name {
            // Early return with custom HTTP status (e.g., 400 Bad Request)
            return { __tezz_status: 400, error: "Name is required" }
         }
         return { success: true, data: body }
       }
     }

  -- 4. Environment Variables --
  Access environment variables uniformly across Node.js and Cloudflare Workers.
     let secret_key = env.API_KEY
     let db_url = env.TURSO_URL

  -- 5. Database / Async / Await --
  Asynchronous behavior is implicit. You don't need 'async' keywords on handlers.
     let db = createClient({ url: env.TURSO_URL, token: env.TURSO_TOKEN })
     
     try {
       let rows = await db.execute("SELECT * FROM users LIMIT 10")
       return { success: true, users: rows }
     } catch err {
       return { __tezz_status: 500, error: "Database failure" }
     }

  -- 6. Complete Deployment Strategy --

  Tezz is designed for the modern edge. It compiles your .tezz code into clean JavaScript 
  that can run anywhere, but it shines on Cloudflare Workers.

  > STRATEGY A: CLOUDFLARE WORKERS (Recommended for Edge)
    1. Initialize your project:
       $ tezz init
    2. Develop locally:
       $ tezz build backend/contact.tezz --target worker
    3. Configure your wrangler.toml:
       Ensure it points to the generated file:
       main = ".tezz/build/contact.js"
    4. Deploy:
       $ npx wrangler deploy
       (Or just use 'tezz deploy backend/contact.tezz')

  > STRATEGY B: NODE.JS (Traditional Servers / VPS / Docker)
    1. Build for Node target (default):
       $ tezz build backend/contact.tezz
       (This generates .tezz/build/contact.js)
    2. Run it using Node directly:
       $ node .tezz/build/contact.js
    3. Production Deployment (e.g. via PM2):
       $ pm2 start .tezz/build/contact.js --name tezz-api

  -- Philosophy --
  Tezz aims for maximum DX (Developer Experience). You write elegant, typed
  code, and the Tezz compiler handles the boilerplate (CORS, Regex routing,
  error handling, async unwrapping) under the hood. The compiler keeps your 
  workspace clean by hiding all generated JS artifacts in '.tezz/build/'.
  `;
  console.log(docs);
}
module.exports = printDocs;

function printDocs() {
  const docs = `
  ⚡ Tezz (तेज़) Language Documentation

  Tezz is a blazing fast, zero-overhead transpiled language for modern backends.
  It compiles down to raw, highly optimized JavaScript for Node.js or Cloudflare Workers.

  -- Core Commands --
  tezz run <file.tezz>     : Compiles and runs a Tezz file immediately.
  tezz dev <file.tezz>     : Runs a Tezz file in watch mode (auto-reload on changes).
  tezz build <file.tezz>   : Compiles a Tezz file to JavaScript (outputs to .tezz/build/).
                             Use --target worker for Cloudflare Workers.
  tezz init                : Initializes a new Tezz project.
  tezz docs                : Displays this documentation.

  -- Syntax Guide --

  1. Variables & Types
     let name = "Abhinav"       // inferred type
     let age: int = 18          // explicit type
     const pi: float = 3.14

  2. Functions
     fn greet(name: string): string {
       return "Hello, " + name
     }

  3. Services (APIs)
     // Start a service on a port
     service on 8787 {
       GET "/api/hello" {
         // Auto-parses JSON and responds with 200 OK
         return { message: "Hello World" }
       }
       
       POST "/api/data" {
         let body = request.json()
         if !body.name {
            // Early return with error status
            return { __tezz_status: 400, error: "Name required" }
         }
         return { success: true, data: body }
       }
     }

  4. Control Flow
     if age > 18 { ... } else { ... }
     
     for item in items { ... }
     
     while true { ... }

  5. Database / Async
     // Async is implicit for await calls
     let db = createClient({ url: env.TURSO_URL })
     let rows = await db.execute("SELECT * FROM users")

  6. Environment Variables
     // Cloudflare Worker & Node compatible
     let key = env.API_KEY

  -- Philosophy --
  Tezz aims for maximum DX (Developer Experience). You write elegant, typed
  code, and the Tezz compiler handles the boilerplate (CORS, Regex routing,
  error handling, async unwrapping) under the hood.

  `;
  console.log(docs);
}
module.exports = printDocs;

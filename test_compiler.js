// Tezz Language — Compiler Unit Test Suite
// Tests Lexer, Parser, Codegen, Modern Features & Runtime Execution

const assert = require('assert');
const { Lexer, TokenType } = require('./src/lexer.js');
const { Parser } = require('./src/parser.js');
const { CodeGenerator } = require('./src/codegen.js');

function compile(source, target = 'node') {
  const lexer = new Lexer(source);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const codegen = new CodeGenerator(ast, { target });
  return { tokens, ast, js: codegen.generate().code };
}

console.log('Running Tezz Compiler Unit Tests...\n');

// 1. Lexer Tests
console.log('Test 1: Lexer tokenization & Hinglish mapping');
{
  const src = `rakho x = 42 pakka name = "Tezz" kaam add(a, b) { vapas a + b }`;
  const lexer = new Lexer(src);
  const tokens = lexer.tokenize();

  assert.strictEqual(tokens[0].type, TokenType.LET, 'rakho should map to LET');
  assert.strictEqual(tokens[4].type, TokenType.CONST, 'pakka should map to CONST');
  assert.strictEqual(tokens[8].type, TokenType.FN, 'kaam should map to FN');
  assert.strictEqual(tokens[16].type, TokenType.RETURN, 'vapas should map to RETURN');
  console.log('✓ Lexer Hinglish mapping verified');
}

// 2. Modern Operators: Spread, Optional Chaining, Nullish Coalescing
console.log('Test 2: Modern syntax (spread, optional chaining, nullish coalescing)');
{
  const src = `
    let user = { profile: { name: "Abhinav" } }
    let name = user?.profile?.name ?? "Anonymous"
    let list = [ 1, ...[2, 3], 4 ]
    let clone = { ...user, active: true }
  `;
  const { js } = compile(src);
  assert(js.includes('user?.profile?.name'), 'Should emit optional chaining');
  assert(js.includes('??'), 'Should emit nullish coalescing');
  assert(js.includes('...[2, 3]'), 'Should emit array spread');
  assert(js.includes('...user'), 'Should emit object spread');
  console.log('✓ Modern operators compiled correctly');
}

// 3. Destructuring in Variable Declarations
console.log('Test 3: Object and Array Destructuring');
{
  const src = `
    let { a, b } = { a: 10, b: 20 }
    pakka [ first, second ] = [ 1, 2 ]
  `;
  const { js } = compile(src);
  assert(js.includes('let { a, b } ='), 'Should emit object destructuring');
  assert(js.includes('const [ first, second ] ='), 'Should emit array destructuring');
  console.log('✓ Destructuring declarations compiled correctly');
}

// 4. Named Imports and Exports
console.log('Test 4: Named imports and exports');
{
  const src = `
    import { Model, connect } from "tezz-orm"
    export fn double(n: int): int {
      return n * 2
    }
  `;
  const { js } = compile(src);
  assert(js.includes("require('tezz-orm')"), 'Should require named import module');
  assert(js.includes("module.exports.double = double") || js.includes("export function double"), 'Should export function');
  console.log('✓ Named imports & exports verified');
}

// 5. Service & WebSocket Codegen
console.log('Test 5: Service and WebSocket Codegen (Node.js & Worker)');
{
  const src = `
    service Gateway on 8080 {
      route GET "/health" {
        respond 200 { status: "ok" }
      }
      socket "/ws" {
        on connect {
          print("Client joined")
        }
        on message(data) {
          socket.send(data)
        }
      }
    }
  `;
  const nodeResult = compile(src, 'node');
  assert(nodeResult.js.includes('http.createServer'), 'Node target must create http server');
  assert(nodeResult.js.includes('handleUpgrade'), 'Node target must handle ws upgrade');
  assert(nodeResult.js.includes('__request = {'), 'Node target must build request object');
  assert(nodeResult.js.includes('body: __parsedBody'), 'Node request must contain body property');

  const workerResult = compile(src, 'worker');
  assert(workerResult.js.includes('export default {'), 'Worker target must export default fetch handler');
  assert(workerResult.js.includes('new WebSocketPair()'), 'Worker target must use WebSocketPair');
  assert(workerResult.js.includes('__rawServer.addEventListener(\'error\''), 'Worker target must handle ws error');
  console.log('✓ Service & WebSocket routing verified for both targets');
}

// 6. Runtime Execution Smoke Test
console.log('Test 6: End-to-end execution of compiled JavaScript');
{
  const src = `
    fn compute(items, fallback) {
      let [ head ] = items
      let name = head?.name ?? fallback
      return name
    }
    let res = compute([{ name: "Tezz" }], "Default")
    print("Result:", res)
  `;
  const { js } = compile(src);
  let capturedOutput = '';
  const originalLog = console.log;
  console.log = (...args) => { capturedOutput += args.join(' '); };

  try {
    eval(js);
  } finally {
    console.log = originalLog;
  }

  assert(capturedOutput.includes('Result: Tezz'), `Expected output to include 'Result: Tezz', got '${capturedOutput}'`);
  console.log('✓ Runtime execution smoke test passed');
}


// Test 7: Source Map Generation (V3)
{
  console.log("Test 7: V3 Source Map Generation");
  const src = `
    let x = 10
    let y = 20
    let z = x + y
  `;
  const lexer = new Lexer(src);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const cg = new CodeGenerator(ast, { sourceFile: "test_math.tezz", sourceContent: src, sourceMap: true });
  const res = cg.generate();

  assert(res.map, "Expected source map to be returned");
  assert.strictEqual(res.map.version, 3, "Source map version must be 3");
  assert.strictEqual(res.map.sources[0], "test_math.tezz", "Source file name matches");
  assert(res.map.mappings.length > 0, "Source map has non-empty mappings");
  console.log("✓ V3 Source Map generated and verified");
}


// Test 8: TypeScript .d.ts Generation
{
  console.log("Test 8: TypeScript .d.ts Generation");
  const { generateDts } = require("./src/dts");
  const src = `
    trait Greeter {
      fn greet(name: string) -> string
    }
    class Bot implements Greeter {
      fn greet(name: string) -> string {
        return "Hello " + name
      }
    }
    fn add(a: int, b: int) -> int {
      return a + b
    }
  `;
  const lexer = new Lexer(src);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const dts = generateDts(ast);

  assert(dts.includes("export interface Greeter"), "Contains Greeter interface");
  assert(dts.includes("export declare class Bot"), "Contains Bot class");
  assert(dts.includes("export declare function add(a: number, b: number): number;"), "Contains typed function signature");
  console.log("✓ TypeScript .d.ts generated and verified");
}

console.log('\nAll Compiler Unit Tests PASSED successfully! ⚡');

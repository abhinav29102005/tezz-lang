// Test: Verification of Type Erasure & Alignment with Tezz Docs
const assert = require('assert');
const { Lexer } = require('./src/lexer');
const { Parser } = require('./src/parser');
const { CodeGenerator } = require('./src/codegen');

console.log('Running Type Annotation & Erasure Tests...\n');

// 1. Tezz docs syntax from `src/docs.js`
const docsSyntax = `
let name = "Abhinav"
let age: int = 18
const pi: float = 3.14
let is_active: bool = true

fn calculate_tax(amount: float, rate: float): float {
  return amount * rate
}
`;

function compile(source) {
  const tokens = new Lexer(source).tokenize();
  const ast = new Parser(tokens).parse();
  return {
    ast,
    js: new CodeGenerator(ast, { target: 'node' }).generate().code
  };
}

// Compile docs snippet
const docsResult = compile(docsSyntax);
console.log('✓ Docs syntax parsed and compiled successfully!');

// Check AST attributes
const letAgeNode = docsResult.ast.body[1];
assert.strictEqual(letAgeNode.type, 'VariableDeclaration');
assert.strictEqual(letAgeNode.name, 'age');
assert.strictEqual(letAgeNode.typeAnn, 'int');

const constPiNode = docsResult.ast.body[2];
assert.strictEqual(constPiNode.type, 'VariableDeclaration');
assert.strictEqual(constPiNode.name, 'pi');
assert.strictEqual(constPiNode.typeAnn, 'float');

const fnTaxNode = docsResult.ast.body[4];
assert.strictEqual(fnTaxNode.type, 'FunctionDeclaration');
assert.strictEqual(fnTaxNode.name, 'calculate_tax');
assert.strictEqual(fnTaxNode.params[0].name, 'amount');
assert.strictEqual(fnTaxNode.params[0].paramType, 'float');
assert.strictEqual(fnTaxNode.params[1].name, 'rate');
assert.strictEqual(fnTaxNode.params[1].paramType, 'float');
assert.strictEqual(fnTaxNode.returnType, 'float');

console.log('✓ AST properly records type annotations on variables, params, and return types');

// 2. Comprehensive Typed vs Untyped equivalence (Type Erasure)
const typedCode = `
let name: string = "Abhinav"
let age: int = 18
const pi: float = 3.14
let is_active: bool = true
rakho count: int = 10

fn calculate_tax(amount: float, rate: float): float {
  return amount * rate
}

fn greet(person: string) -> string {
  return "Hello " + person
}

class Calculator {
  add(a: int, b: int): int {
    return a + b
  }
}

trait Provider {
  fn fetch(id: int): string
}
`;

const untypedCode = `
let name = "Abhinav"
let age = 18
const pi = 3.14
let is_active = true
rakho count = 10

fn calculate_tax(amount, rate) {
  return amount * rate
}

fn greet(person) {
  return "Hello " + person
}

class Calculator {
  add(a, b) {
    return a + b
  }
}

trait Provider {
  fn fetch(id)
}
`;

const resTyped = compile(typedCode);
const resUntyped = compile(untypedCode);

// Strip timestamp comment line for exact byte comparison
const stripTimestamp = (js) => js.replace(/\/\/ Generated at: .*\n/, '');

assert.strictEqual(
  stripTimestamp(resTyped.js),
  stripTimestamp(resUntyped.js),
  'Typed and untyped code must generate BYTE-IDENTICAL JavaScript (type erasure)!'
);

console.log('✓ Type Erasure verified: Typed and untyped code produce byte-identical JavaScript!');

console.log('\nAll Type Annotation tests PASSED!\n');

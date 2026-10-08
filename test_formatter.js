// Test suite for Tezz Auto-Formatter (tezz fmt)
const assert = require('assert');
const { Formatter } = require('./src/formatter');
const { Lexer } = require('./src/lexer');
const { Parser } = require('./src/parser');

console.log('Running Tezz Auto-Formatter Tests...\n');

const formatter = new Formatter({ indentSize: 2 });

// Test 1: Messy indentation and spacing
console.log('Test 1: Normalizing indentation and operator spacing');
const messyCode = `
service App on 3000{
route GET "/health"{
rakho x=10+5
respond 200{status:"ok",count:x}
}
}
`;

const formatted = formatter.formatSafe(messyCode, 'messy.tezz');
console.log('Formatted output:\n' + formatted);

assert(formatted.includes('service App on 3000 {'), 'Space before {');
assert(formatted.includes('  route GET "/health" {'), '2-space indentation');
assert(formatted.includes('    rakho x = 10 + 5'), 'Spaces around = and +');
assert(formatted.includes('    respond 200 { status: "ok", count: x }'), 'Object spacing');
assert(formatted.includes('  }'), 'Nested close brace indent');
assert(formatted.endsWith('}\n'), 'Clean trailing newline');
console.log('✓ Messy code successfully formatted to canonical style\n');

// Test 2: Idempotency (formatting twice gives exact same result)
console.log('Test 2: Idempotency (fmt(fmt(x)) === fmt(x))');
const secondPass = formatter.formatSafe(formatted, 'idempotent.tezz');
assert.strictEqual(formatted, secondPass, 'Formatter must be idempotent');
console.log('✓ Idempotency verified\n');

// Test 3: Comments & Strings preservation
console.log('Test 3: Preserving comments and string contents');
const commentCode = `
-- Top-level comment
service TestAPI on 8080 {
  -- Route comment
  route GET "/hello" {
    let msg = "  exact   spaces   preserved  "
    respond 200 { message: msg }
  }
}
`;

const formattedComments = formatter.formatSafe(commentCode, 'comments.tezz');
assert(formattedComments.includes('-- Top-level comment'), 'Preserves top-level comment');
assert(formattedComments.includes('  -- Route comment'), 'Indents route comment');
assert(formattedComments.includes('"  exact   spaces   preserved  "'), 'Preserves string literal contents exactly');
console.log('✓ Comments and strings preserved\n');

// Test 4: Real-world file test on examples/hello.tezz
console.log('Test 4: Formatting existing repo example');
const fs = require('fs');
const helloSrc = fs.readFileSync('examples/hello.tezz', 'utf8');
const helloFmt = formatter.formatSafe(helloSrc, 'hello.tezz');
assert(helloFmt.length > 0);
console.log('✓ examples/hello.tezz formatted cleanly\n');

// Test 5: OOP and control flow with formatSafe
console.log('Test 5: OOP and control flow');
const oopCode = `
class Calculator {
constructor(base){
this.base=base
}
add(x){
if(x>0){
return this.base+x
}else{
return this.base
}
}
}
`;
const oopFmt = formatter.formatSafe(oopCode, 'oop.tezz');
assert(oopFmt.includes('class Calculator {'));
assert(oopFmt.includes('  constructor(base) {'));
assert(oopFmt.includes('    this.base = base'));
assert(oopFmt.includes('    if (x > 0) {'));
assert(oopFmt.includes('      return this.base + x'));
assert(oopFmt.includes('    } else {'));
console.log('✓ OOP and control flow formatted cleanly\n');

// Test 6: Spacing for type annotations and arrow syntax
console.log('Test 6: Type annotations and arrow operator spacing');
const typeSnippet = 'fn compute(a:int, b:int) -> int { rakho x = a + b }';
const formattedSnippet = formatter.format(typeSnippet);
assert(formattedSnippet.includes('fn compute(a: int, b: int) -> int {'));
assert(formattedSnippet.includes('rakho x = a + b'));
console.log('✓ Type annotations and arrow operators formatted cleanly\n');

// Test 7: Safety gate (refuse to format invalid syntax)
console.log('Test 7: Refusing to format broken syntax');
let threwError = false;
try {
  formatter.formatSafe('service { broken', 'broken.tezz');
} catch (e) {
  threwError = true;
  assert(e.message.includes('syntax errors'));
}
assert(threwError, 'formatSafe must reject invalid syntax');
console.log('✓ Safety check successfully prevented formatting invalid code\n');

console.log('All Formatter Tests PASSED successfully!\n');

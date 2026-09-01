import re

# 1. Patch Parser
with open("src/parser.js", "r") as f:
    parser = f.read()

# Replace parseAssignment's call to parseOr with parseRange
parser = parser.replace(
    "const expr = this.parseOr();",
    "const expr = this.parseRange();"
)

# Insert parseRange method right after parseAssignment
range_method = """
  parseRange() {
    let left = this.parseOr();
    if (this.check(TokenType.DOT_DOT)) {
      this.advance();
      let right = this.parseOr();
      return { type: 'RangeExpression', start: left, end: right };
    }
    return left;
  }

  parseOr() {"""

parser = parser.replace("  parseOr() {", range_method)

with open("src/parser.js", "w") as f:
    f.write(parser)
print("Parser patched with RangeExpression.")

# 2. Patch Codegen
with open("src/codegen.js", "r") as f:
    codegen = f.read()

# Inject RangeExpression into genExpr
range_codegen = """      case 'RangeExpression':
        return `Array.from({length: (${this.genExpr(node.end)}) - (${this.genExpr(node.start)}) + 1}, (_, __i) => (${this.genExpr(node.start)}) + __i)`;
      case 'BinaryExpression':"""

codegen = codegen.replace("      case 'BinaryExpression':", range_codegen)

with open("src/codegen.js", "w") as f:
    f.write(codegen)
print("Codegen patched with RangeExpression.")


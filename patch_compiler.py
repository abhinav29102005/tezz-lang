import re

# 1. Patch Lexer
with open("src/lexer.js", "r") as f:
    lexer = f.read()

lexer = lexer.replace("DOT: 'DOT',", "DOT: 'DOT', DOT_DOT: 'DOT_DOT',")
lexer = lexer.replace(
    "if (ch === '.') { this.addToken(TokenType.DOT, '.'); continue; }",
    """if (ch === '.') {
        if (this.match('.')) { this.addToken(TokenType.DOT_DOT, '..'); }
        else { this.addToken(TokenType.DOT, '.'); }
        continue;
      }"""
)
with open("src/lexer.js", "w") as f:
    f.write(lexer)
print("Lexer patched.")

# 2. Patch Parser
with open("src/parser.js", "r") as f:
    parser = f.read()

# I need to insert parseRange inside parseExpression.
# Currently parser.js might have:
# parseExpression() {
#   return this.parseAssignment();
# }
# Let's see what parseExpression looks like.

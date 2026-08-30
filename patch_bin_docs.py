import sys

with open("bin/tezz.js", "r") as f:
    content = f.read()

# Add require for docs
content = "const printDocs = require('../src/docs.js');\n" + content

# Add case for docs
switch_replacement = """  case 'docs':
    printDocs();
    break;
  case 'repl':"""

content = content.replace("  case 'repl':", switch_replacement)

with open("bin/tezz.js", "w") as f:
    f.write(content)

print("bin/tezz.js patched with docs command")

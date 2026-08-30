import sys

with open("bin/tezz.js", "r") as f:
    lines = f.readlines()

# Remove all shebangs and requires from top
clean_lines = [l for l in lines if not l.startswith("#!/usr/bin/env node") and not l.startswith("const printDocs = require")]

# Insert clean header
final_lines = ["#!/usr/bin/env node\n", "const printDocs = require('../src/docs.js');\n"] + clean_lines

with open("bin/tezz.js", "w") as f:
    f.writelines(final_lines)

import re

with open("tezz-vscode/server/src/server.ts", "r") as f:
    server = f.read()

completion_items = """      { label: 'service', kind: CompletionItemKind.Keyword, data: 1 },
      { label: 'GET', kind: CompletionItemKind.Method, data: 2 },
      { label: 'POST', kind: CompletionItemKind.Method, data: 3 },
      { label: 'fn', kind: CompletionItemKind.Keyword, data: 4 },
      { label: 'let', kind: CompletionItemKind.Keyword, data: 5 },
      { label: 'const', kind: CompletionItemKind.Keyword, data: 6 },
      { label: 'return', kind: CompletionItemKind.Keyword, data: 7 },
      { label: 'spawn', kind: CompletionItemKind.Function, data: 8 },
      { label: 'if', kind: CompletionItemKind.Keyword, data: 9 },
      { label: 'else', kind: CompletionItemKind.Keyword, data: 10 },
      { label: 'Math', kind: CompletionItemKind.Module, data: 11 },
      { label: 'JSON', kind: CompletionItemKind.Module, data: 12 },
      { label: 'File', kind: CompletionItemKind.Module, data: 13 },
      { label: 'System', kind: CompletionItemKind.Module, data: 14 }"""

server = re.sub(
    r"\{\s*label:\s*'service'.*?\{\s*label:\s*'else'.*?\}",
    completion_items,
    server,
    flags=re.DOTALL
)

docs_additions = """      3: { detail: 'POST Route', doc: 'Defines a POST route handler.' },
      11: { detail: 'Standard Library: Math', doc: 'Native Tezz Math module. Includes .random(), .min(), .max(), .round(), etc.' },
      12: { detail: 'Standard Library: JSON', doc: 'Native Tezz JSON module. Includes .parse(), .stringify().' },
      13: { detail: 'Standard Library: File', doc: 'Native Tezz File system module. Includes .readSync(), .writeSync().' },
      14: { detail: 'Standard Library: System', doc: 'Native Tezz System module. Includes .env, .exit().' }"""

server = server.replace(
    "3: { detail: 'POST Route', doc: 'Defines a POST route handler.' }",
    docs_additions
)

with open("tezz-vscode/server/src/server.ts", "w") as f:
    f.write(server)
print("Server patched.")

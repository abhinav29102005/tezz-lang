import { CompletionItemKind } from 'vscode-languageserver/node';

export interface KeywordItem {
  label: string;
  kind: CompletionItemKind;
  data: number;
  detail: string;
  documentation: string;
}

export const tezzKeywords: KeywordItem[] = [
  // Edge & Service Keywords
  { label: 'service', kind: CompletionItemKind.Keyword, data: 1, detail: 'Service Definition', documentation: 'Defines an HTTP/WebSocket service natively on the edge.\n\nExample:\nservice MyAPI on 8080 {\n  route GET "/" { ... }\n}' },
  { label: 'route', kind: CompletionItemKind.Keyword, data: 2, detail: 'Route Handler', documentation: 'Defines an HTTP route inside a service.\n\nExample:\nroute GET "/users" { ... }' },
  { label: 'respond', kind: CompletionItemKind.Keyword, data: 3, detail: 'HTTP Response', documentation: 'Sends an HTTP response.\n\nExample:\nrespond 200 { status: "OK" }' },
  { label: 'GET', kind: CompletionItemKind.Method, data: 4, detail: 'GET Route', documentation: 'HTTP GET method for route handling.' },
  { label: 'POST', kind: CompletionItemKind.Method, data: 5, detail: 'POST Route', documentation: 'HTTP POST method for route handling.' },
  { label: 'PUT', kind: CompletionItemKind.Method, data: 33, detail: 'PUT Route', documentation: 'HTTP PUT method for route handling.' },
  { label: 'DELETE', kind: CompletionItemKind.Method, data: 34, detail: 'DELETE Route', documentation: 'HTTP DELETE method for route handling.' },
  { label: 'PATCH', kind: CompletionItemKind.Method, data: 35, detail: 'PATCH Route', documentation: 'HTTP PATCH method for route handling.' },
  { label: 'socket', kind: CompletionItemKind.Keyword, data: 50, detail: 'WebSocket Route', documentation: 'Defines a real-time WebSocket route inside a service.\n\nExample:\nsocket "/chat" {\n  on connect { print("Client connected"); }\n  on message(data) { socket.send(data); }\n  on close { print("Disconnected"); }\n}' },
  { label: 'on', kind: CompletionItemKind.Keyword, data: 51, detail: 'Event Listener', documentation: 'Attaches an event handler inside a socket block or service.\n\nExample:\non message(data) { socket.send(data); }' },

  // Standard English Keywords
  { label: 'let', kind: CompletionItemKind.Keyword, data: 6, detail: 'Variable Declaration', documentation: 'Declares a mutable variable.' },
  { label: 'const', kind: CompletionItemKind.Keyword, data: 7, detail: 'Constant Declaration', documentation: 'Declares an immutable constant.' },
  { label: 'if', kind: CompletionItemKind.Keyword, data: 8, detail: 'If Statement', documentation: 'Conditional logic block.' },
  { label: 'else', kind: CompletionItemKind.Keyword, data: 9, detail: 'Else Statement', documentation: 'Fallback conditional logic block.' },
  { label: 'while', kind: CompletionItemKind.Keyword, data: 10, detail: 'While Loop', documentation: 'Executes a block while a condition is true.' },
  { label: 'for', kind: CompletionItemKind.Keyword, data: 11, detail: 'For Loop', documentation: 'Iterates over a range or collection.' },
  { label: 'in', kind: CompletionItemKind.Keyword, data: 12, detail: 'In Keyword', documentation: 'Used in for-loops to iterate over items.' },
  { label: 'fn', kind: CompletionItemKind.Keyword, data: 13, detail: 'Function Definition', documentation: 'Defines a new function.' },
  { label: 'return', kind: CompletionItemKind.Keyword, data: 14, detail: 'Return Statement', documentation: 'Returns a value from a function.' },
  { label: 'print', kind: CompletionItemKind.Function, data: 15, detail: 'Print', documentation: 'Outputs a value to the console/stdout.' },

  // OOP Keywords (English)
  { label: 'class', kind: CompletionItemKind.Class, data: 16, detail: 'Class Definition', documentation: 'Defines an object-oriented class.' },
  { label: 'extends', kind: CompletionItemKind.Keyword, data: 17, detail: 'Class Inheritance', documentation: 'Extends another class to inherit its properties.' },
  { label: 'constructor', kind: CompletionItemKind.Constructor, data: 18, detail: 'Constructor', documentation: 'Initializes a new instance of a class.' },
  { label: 'new', kind: CompletionItemKind.Keyword, data: 19, detail: 'Object Instantiation', documentation: 'Creates a new instance of a class.' },
  { label: 'this', kind: CompletionItemKind.Keyword, data: 20, detail: 'Self Reference', documentation: 'Refers to the current class instance.' },

  // Advanced Features
  { label: 'try', kind: CompletionItemKind.Keyword, data: 21, detail: 'Try Block', documentation: 'Executes a block of code and catches exceptions.' },
  { label: 'catch', kind: CompletionItemKind.Keyword, data: 22, detail: 'Catch Block', documentation: 'Catches exceptions thrown in a try block.' },
  { label: 'throw', kind: CompletionItemKind.Keyword, data: 23, detail: 'Throw Exception', documentation: 'Throws a new exception.' },
  { label: 'async', kind: CompletionItemKind.Keyword, data: 24, detail: 'Async Function', documentation: 'Defines an asynchronous function or method.' },
  { label: 'await', kind: CompletionItemKind.Keyword, data: 25, detail: 'Await Expression', documentation: 'Pauses execution until a promise resolves.' },
  { label: 'background', kind: CompletionItemKind.Keyword, data: 26, detail: 'Background Task', documentation: 'Runs a block asynchronously without blocking the main event loop.' },
  { label: 'spawn', kind: CompletionItemKind.Function, data: 27, detail: 'Spawn Thread', documentation: 'Spawns a new worker thread for heavy computation.' },
  { label: 'import', kind: CompletionItemKind.Keyword, data: 28, detail: 'Import Module', documentation: 'Imports code from another module or standard library.' },
  { label: 'from', kind: CompletionItemKind.Keyword, data: 29, detail: 'From Module', documentation: 'Specifies the module path in an import statement.' },
  { label: 'export', kind: CompletionItemKind.Keyword, data: 52, detail: 'Export Statement', documentation: 'Exports functions, classes, or constants from the module.' },
  { label: 'macro', kind: CompletionItemKind.Keyword, data: 30, detail: 'Macro Definition', documentation: 'Defines a compile-time macro for metaprogramming.' },
  { label: 'enum', kind: CompletionItemKind.Enum, data: 31, detail: 'Enum Definition', documentation: 'Defines a set of named constants.' },
  { label: 'trait', kind: CompletionItemKind.Interface, data: 32, detail: 'Trait Definition', documentation: 'Defines an interface that classes can implement.' },

  // Primitive Type Annotations
  { label: 'int', kind: CompletionItemKind.TypeParameter, data: 60, detail: 'Primitive Type: Integer', documentation: 'Integer type annotation for variables and parameters.' },
  { label: 'string', kind: CompletionItemKind.TypeParameter, data: 61, detail: 'Primitive Type: String', documentation: 'UTF-8 String type annotation.' },
  { label: 'bool', kind: CompletionItemKind.TypeParameter, data: 62, detail: 'Primitive Type: Boolean', documentation: 'Boolean (true / false) type annotation.' },
  { label: 'float', kind: CompletionItemKind.TypeParameter, data: 63, detail: 'Primitive Type: Float', documentation: 'Floating-point number type annotation.' },
  { label: 'any', kind: CompletionItemKind.TypeParameter, data: 64, detail: 'Type: Any', documentation: 'Permissive any type annotation.' },
  { label: 'void', kind: CompletionItemKind.TypeParameter, data: 65, detail: 'Return Type: Void', documentation: 'Specifies a function returns no value.' },

  // Hinglish Keywords
  { label: 'rakho', kind: CompletionItemKind.Keyword, data: 101, detail: 'Hinglish: Variable (let)', documentation: 'Hinglish equivalent of \'let\'.' },
  { label: 'pakka', kind: CompletionItemKind.Keyword, data: 123, detail: 'Hinglish: Constant (const)', documentation: 'Hinglish equivalent of \'const\'.' },
  { label: 'kaam', kind: CompletionItemKind.Keyword, data: 105, detail: 'Hinglish: Function (fn)', documentation: 'Hinglish equivalent of \'fn\'.' },
  { label: 'seva', kind: CompletionItemKind.Keyword, data: 120, detail: 'Hinglish: Service', documentation: 'Hinglish equivalent of \'service\'.' },
  { label: 'rasta', kind: CompletionItemKind.Keyword, data: 121, detail: 'Hinglish: Route', documentation: 'Hinglish equivalent of \'route\'.' },
  { label: 'jawab', kind: CompletionItemKind.Keyword, data: 122, detail: 'Hinglish: Respond', documentation: 'Hinglish equivalent of \'respond\'.' },
  { label: 'agar', kind: CompletionItemKind.Keyword, data: 102, detail: 'Hinglish: If', documentation: 'Hinglish equivalent of \'if\'.' },
  { label: 'warna', kind: CompletionItemKind.Keyword, data: 103, detail: 'Hinglish: Else', documentation: 'Hinglish equivalent of \'else\'.' },
  { label: 'jabtak', kind: CompletionItemKind.Keyword, data: 104, detail: 'Hinglish: While Loop', documentation: 'Hinglish equivalent of \'while\'.' },
  { label: 'har', kind: CompletionItemKind.Keyword, data: 128, detail: 'Hinglish: For Loop', documentation: 'Hinglish equivalent of \'for\'.' },
  { label: 'mein', kind: CompletionItemKind.Keyword, data: 129, detail: 'Hinglish: In', documentation: 'Hinglish equivalent of \'in\'.' },
  { label: 'vapas', kind: CompletionItemKind.Keyword, data: 106, detail: 'Hinglish: Return', documentation: 'Hinglish equivalent of \'return\'.' },
  { label: 'dikha', kind: CompletionItemKind.Function, data: 107, detail: 'Hinglish: Print', documentation: 'Hinglish equivalent of \'print\'.' },
  { label: 'dhancha', kind: CompletionItemKind.Class, data: 108, detail: 'Hinglish: Class', documentation: 'Hinglish equivalent of \'class\'.' },
  { label: 'se_bana', kind: CompletionItemKind.Keyword, data: 109, detail: 'Hinglish: Extends', documentation: 'Hinglish equivalent of \'extends\'.' },
  { label: 'naya', kind: CompletionItemKind.Keyword, data: 110, detail: 'Hinglish: New', documentation: 'Hinglish equivalent of \'new\'.' },
  { label: 'yeh', kind: CompletionItemKind.Keyword, data: 111, detail: 'Hinglish: This', documentation: 'Hinglish equivalent of \'this\'.' },
  { label: 'koshish', kind: CompletionItemKind.Keyword, data: 112, detail: 'Hinglish: Try', documentation: 'Hinglish equivalent of \'try\'.' },
  { label: 'pakad', kind: CompletionItemKind.Keyword, data: 113, detail: 'Hinglish: Catch', documentation: 'Hinglish equivalent of \'catch\'.' },
  { label: 'ruko', kind: CompletionItemKind.Keyword, data: 114, detail: 'Hinglish: Await', documentation: 'Hinglish equivalent of \'await\'.' },
  { label: 'baadmein', kind: CompletionItemKind.Keyword, data: 115, detail: 'Hinglish: Async', documentation: 'Hinglish equivalent of \'async\'.' },
  { label: 'lao', kind: CompletionItemKind.Keyword, data: 116, detail: 'Hinglish: Import', documentation: 'Hinglish equivalent of \'import\'.' },
  { label: 'bhejo', kind: CompletionItemKind.Keyword, data: 124, detail: 'Hinglish: Export', documentation: 'Hinglish equivalent of \'export\'.' },
  { label: 'sahi', kind: CompletionItemKind.Constant, data: 125, detail: 'Hinglish: True', documentation: 'Hinglish equivalent of \'true\'.' },
  { label: 'galat', kind: CompletionItemKind.Constant, data: 126, detail: 'Hinglish: False', documentation: 'Hinglish equivalent of \'false\'.' },
  { label: 'khali', kind: CompletionItemKind.Constant, data: 127, detail: 'Hinglish: Null', documentation: 'Hinglish equivalent of \'null\'.' },

  // Standard Libraries & Official Ecosystem Packages
  { label: 'Math', kind: CompletionItemKind.Module, data: 201, detail: 'Standard Library: Math', documentation: 'Native Tezz Math module. Includes .random(), .min(), .max(), .round(), etc.' },
  { label: 'JSON', kind: CompletionItemKind.Module, data: 202, detail: 'Standard Library: JSON', documentation: 'Native Tezz JSON module. Includes .parse(), .stringify().' },
  { label: 'Date', kind: CompletionItemKind.Module, data: 203, detail: 'Standard Library: Date', documentation: 'Native Tezz Date module. Includes .now().' },
  { label: 'tezz-postgres', kind: CompletionItemKind.Module, data: 204, detail: 'Package: PostgreSQL Driver', documentation: 'High-performance PostgreSQL driver with connection pooling for Tezz.\n\nExample:\nimport { createPool } from "tezz-postgres"\nconst pool = createPool({ url: env.DATABASE_URL })' },
  { label: 'tezz-redis', kind: CompletionItemKind.Module, data: 205, detail: 'Package: Redis Driver', documentation: 'Ultra-fast Redis cache & key-value client for Tezz.\n\nExample:\nimport { createClient } from "tezz-redis"\nconst redis = createClient({ url: env.REDIS_URL })' },
  { label: 'tezz-orm', kind: CompletionItemKind.Module, data: 206, detail: 'Package: SQLite ORM', documentation: 'Lightweight Active-Record ORM for Tezz backed by SQLite.' },
  { label: 'tezz-brain', kind: CompletionItemKind.Module, data: 207, detail: 'Package: Neural Networks', documentation: 'Zero-dependency neural network and AI tensor library for Tezz.' },
  { label: 'tezz-llm', kind: CompletionItemKind.Module, data: 208, detail: 'Package: LLM Integration', documentation: 'LangChain & provider integrations (OpenAI, Gemini, Anthropic) for Tezz.' }
];

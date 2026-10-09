"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tezzKeywords = void 0;
const node_1 = require("vscode-languageserver/node");
exports.tezzKeywords = [
    // Edge & Service Keywords
    { label: 'service', kind: node_1.CompletionItemKind.Keyword, data: 1, detail: 'Service Definition', documentation: 'Defines an HTTP service natively on the edge.\n\nExample:\nservice MyAPI on 8080 {\n  route GET "/" { ... }\n}' },
    { label: 'route', kind: node_1.CompletionItemKind.Keyword, data: 2, detail: 'Route Handler', documentation: 'Defines an HTTP route inside a service.\n\nExample:\nroute GET "/users" { ... }' },
    { label: 'respond', kind: node_1.CompletionItemKind.Keyword, data: 3, detail: 'HTTP Response', documentation: 'Sends an HTTP response.\n\nExample:\nrespond 200 { status: "OK" }' },
    { label: 'GET', kind: node_1.CompletionItemKind.Method, data: 4, detail: 'GET Route', documentation: 'HTTP GET method for route handling.' },
    { label: 'POST', kind: node_1.CompletionItemKind.Method, data: 5, detail: 'POST Route', documentation: 'HTTP POST method for route handling.' },
    // Standard English Keywords
    { label: 'let', kind: node_1.CompletionItemKind.Keyword, data: 6, detail: 'Variable Declaration', documentation: 'Declares a mutable variable.' },
    { label: 'const', kind: node_1.CompletionItemKind.Keyword, data: 7, detail: 'Constant Declaration', documentation: 'Declares an immutable constant.' },
    { label: 'if', kind: node_1.CompletionItemKind.Keyword, data: 8, detail: 'If Statement', documentation: 'Conditional logic block.' },
    { label: 'else', kind: node_1.CompletionItemKind.Keyword, data: 9, detail: 'Else Statement', documentation: 'Fallback conditional logic block.' },
    { label: 'while', kind: node_1.CompletionItemKind.Keyword, data: 10, detail: 'While Loop', documentation: 'Executes a block while a condition is true.' },
    { label: 'for', kind: node_1.CompletionItemKind.Keyword, data: 11, detail: 'For Loop', documentation: 'Iterates over a range or collection.' },
    { label: 'in', kind: node_1.CompletionItemKind.Keyword, data: 12, detail: 'In Keyword', documentation: 'Used in for-loops to iterate over items.' },
    { label: 'fn', kind: node_1.CompletionItemKind.Keyword, data: 13, detail: 'Function Definition', documentation: 'Defines a new function.' },
    { label: 'return', kind: node_1.CompletionItemKind.Keyword, data: 14, detail: 'Return Statement', documentation: 'Returns a value from a function.' },
    { label: 'print', kind: node_1.CompletionItemKind.Function, data: 15, detail: 'Print', documentation: 'Outputs a value to the console/stdout.' },
    // OOP Keywords (English)
    { label: 'class', kind: node_1.CompletionItemKind.Class, data: 16, detail: 'Class Definition', documentation: 'Defines an object-oriented class.' },
    { label: 'extends', kind: node_1.CompletionItemKind.Keyword, data: 17, detail: 'Class Inheritance', documentation: 'Extends another class to inherit its properties.' },
    { label: 'constructor', kind: node_1.CompletionItemKind.Constructor, data: 18, detail: 'Constructor', documentation: 'Initializes a new instance of a class.' },
    { label: 'new', kind: node_1.CompletionItemKind.Keyword, data: 19, detail: 'Object Instantiation', documentation: 'Creates a new instance of a class.' },
    { label: 'this', kind: node_1.CompletionItemKind.Keyword, data: 20, detail: 'Self Reference', documentation: 'Refers to the current class instance.' },
    // Advanced Features
    { label: 'try', kind: node_1.CompletionItemKind.Keyword, data: 21, detail: 'Try Block', documentation: 'Executes a block of code and catches exceptions.' },
    { label: 'catch', kind: node_1.CompletionItemKind.Keyword, data: 22, detail: 'Catch Block', documentation: 'Catches exceptions thrown in a try block.' },
    { label: 'throw', kind: node_1.CompletionItemKind.Keyword, data: 23, detail: 'Throw Exception', documentation: 'Throws a new exception.' },
    { label: 'async', kind: node_1.CompletionItemKind.Keyword, data: 24, detail: 'Async Function', documentation: 'Defines an asynchronous function or method.' },
    { label: 'await', kind: node_1.CompletionItemKind.Keyword, data: 25, detail: 'Await Expression', documentation: 'Pauses execution until a promise resolves.' },
    { label: 'background', kind: node_1.CompletionItemKind.Keyword, data: 26, detail: 'Background Task', documentation: 'Runs a block asynchronously without blocking the main event loop.' },
    { label: 'spawn', kind: node_1.CompletionItemKind.Function, data: 27, detail: 'Spawn Thread', documentation: 'Spawns a new worker thread for heavy computation.' },
    { label: 'import', kind: node_1.CompletionItemKind.Keyword, data: 28, detail: 'Import Module', documentation: 'Imports code from another module or standard library.' },
    { label: 'from', kind: node_1.CompletionItemKind.Keyword, data: 29, detail: 'From Module', documentation: 'Specifies the module path in an import statement.' },
    { label: 'macro', kind: node_1.CompletionItemKind.Keyword, data: 30, detail: 'Macro Definition', documentation: 'Defines a compile-time macro for metaprogramming.' },
    { label: 'enum', kind: node_1.CompletionItemKind.Enum, data: 31, detail: 'Enum Definition', documentation: 'Defines a set of named constants.' },
    { label: 'trait', kind: node_1.CompletionItemKind.Interface, data: 32, detail: 'Trait Definition', documentation: 'Defines an interface that classes can implement.' },
    // Hinglish Keywords
    { label: 'rakho', kind: node_1.CompletionItemKind.Keyword, data: 101, detail: 'Hinglish: Variable (let)', documentation: 'Hinglish equivalent of \'let\'.' },
    { label: 'agar', kind: node_1.CompletionItemKind.Keyword, data: 102, detail: 'Hinglish: If', documentation: 'Hinglish equivalent of \'if\'.' },
    { label: 'warna', kind: node_1.CompletionItemKind.Keyword, data: 103, detail: 'Hinglish: Else', documentation: 'Hinglish equivalent of \'else\'.' },
    { label: 'jabtak', kind: node_1.CompletionItemKind.Keyword, data: 104, detail: 'Hinglish: While Loop', documentation: 'Hinglish equivalent of \'while\'.' },
    { label: 'karya', kind: node_1.CompletionItemKind.Keyword, data: 105, detail: 'Hinglish: Function (fn)', documentation: 'Hinglish equivalent of \'fn\'.' },
    { label: 'wapas', kind: node_1.CompletionItemKind.Keyword, data: 106, detail: 'Hinglish: Return', documentation: 'Hinglish equivalent of \'return\'.' },
    { label: 'dikha', kind: node_1.CompletionItemKind.Function, data: 107, detail: 'Hinglish: Print', documentation: 'Hinglish equivalent of \'print\'.' },
    { label: 'dhancha', kind: node_1.CompletionItemKind.Class, data: 108, detail: 'Hinglish: Class', documentation: 'Hinglish equivalent of \'class\'.' },
    { label: 'se_bana', kind: node_1.CompletionItemKind.Keyword, data: 109, detail: 'Hinglish: Extends', documentation: 'Hinglish equivalent of \'extends\'.' },
    { label: 'naya', kind: node_1.CompletionItemKind.Keyword, data: 110, detail: 'Hinglish: New', documentation: 'Hinglish equivalent of \'new\'.' },
    { label: 'yeh', kind: node_1.CompletionItemKind.Keyword, data: 111, detail: 'Hinglish: This', documentation: 'Hinglish equivalent of \'this\'.' },
    { label: 'koshish', kind: node_1.CompletionItemKind.Keyword, data: 112, detail: 'Hinglish: Try', documentation: 'Hinglish equivalent of \'try\'.' },
    { label: 'pakad', kind: node_1.CompletionItemKind.Keyword, data: 113, detail: 'Hinglish: Catch', documentation: 'Hinglish equivalent of \'catch\'.' },
    { label: 'ruko', kind: node_1.CompletionItemKind.Keyword, data: 114, detail: 'Hinglish: Await', documentation: 'Hinglish equivalent of \'await\'.' },
    { label: 'baadmein', kind: node_1.CompletionItemKind.Keyword, data: 115, detail: 'Hinglish: Async', documentation: 'Hinglish equivalent of \'async\'.' },
    { label: 'lao', kind: node_1.CompletionItemKind.Keyword, data: 116, detail: 'Hinglish: Import', documentation: 'Hinglish equivalent of \'import\'.' },
    { label: 'se', kind: node_1.CompletionItemKind.Keyword, data: 117, detail: 'Hinglish: From', documentation: 'Hinglish equivalent of \'from\'.' },
    // Standard Libraries
    { label: 'Math', kind: node_1.CompletionItemKind.Module, data: 201, detail: 'Standard Library: Math', documentation: 'Native Tezz Math module. Includes .random(), .min(), .max(), .round(), etc.' },
    { label: 'JSON', kind: node_1.CompletionItemKind.Module, data: 202, detail: 'Standard Library: JSON', documentation: 'Native Tezz JSON module. Includes .parse(), .stringify().' },
    { label: 'Date', kind: node_1.CompletionItemKind.Module, data: 203, detail: 'Standard Library: Date', documentation: 'Native Tezz Date module. Includes .now().' }
];
//# sourceMappingURL=keywords.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
let Lexer;
let Parser;
try {
    const lexerModule = require('../../../src/lexer.js');
    const parserModule = require('../../../src/parser.js');
    Lexer = lexerModule.Lexer;
    Parser = parserModule.Parser;
}
catch (e) {
    console.error("Failed to load Tezz compiler", e);
}
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
connection.onInitialize((params) => {
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true
            }
        }
    };
});
connection.onInitialized(() => {
    connection.console.log('Tezz Language Server with Real Compiler Integration Initialized');
});
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});
async function validateTextDocument(textDocument) {
    const text = textDocument.getText();
    const diagnostics = [];
    if (Lexer && Parser) {
        try {
            const lexer = new Lexer(text);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            parser.parse(); // Throws on syntax error
        }
        catch (e) {
            const errorMessage = e.message || String(e);
            const lineMatch = errorMessage.match(/Line (\d+):/);
            if (lineMatch && lineMatch[1]) {
                const line = parseInt(lineMatch[1], 10) - 1;
                const lines = text.split('\n');
                let startChar = 0;
                let endChar = lines[line] ? lines[line].length : 0;
                // Find the specific token causing the error if it's explicitly stated
                const expectedMatch = errorMessage.match(/Expected.*got '([^']+)'/i);
                if (expectedMatch && expectedMatch[1]) {
                    const badToken = expectedMatch[1];
                    const tokenIdx = lines[line].indexOf(badToken);
                    if (tokenIdx !== -1) {
                        startChar = tokenIdx;
                        endChar = tokenIdx + badToken.length;
                    }
                }
                else {
                    // Trim leading whitespace for better squiggle
                    const trimmedMatch = lines[line].match(/^(\s+)/);
                    if (trimmedMatch) {
                        startChar = trimmedMatch[1].length;
                    }
                }
                const diagnostic = {
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: line, character: startChar },
                        end: { line: line, character: endChar }
                    },
                    message: errorMessage,
                    source: 'Tezz Compiler'
                };
                diagnostics.push(diagnostic);
            }
        }
    }
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
connection.onCompletion((_textDocumentPosition) => {
    return [
        { label: 'service', kind: node_1.CompletionItemKind.Keyword, data: 1 },
        { label: 'GET', kind: node_1.CompletionItemKind.Method, data: 2 },
        { label: 'POST', kind: node_1.CompletionItemKind.Method, data: 3 },
        { label: 'fn', kind: node_1.CompletionItemKind.Keyword, data: 4 },
        { label: 'let', kind: node_1.CompletionItemKind.Keyword, data: 5 },
        { label: 'const', kind: node_1.CompletionItemKind.Keyword, data: 6 },
        { label: 'return', kind: node_1.CompletionItemKind.Keyword, data: 7 },
        { label: 'spawn', kind: node_1.CompletionItemKind.Function, data: 8 },
        { label: 'if', kind: node_1.CompletionItemKind.Keyword, data: 9 },
        { label: 'else', kind: node_1.CompletionItemKind.Keyword, data: 10 }
    ];
});
connection.onCompletionResolve((item) => {
    const docs = {
        1: { detail: 'Service Definition', doc: 'Defines an HTTP service.\n\nExample:\nservice on 8787 {\n  GET "/" {\n    return { success: true }\n  }\n}' },
        2: { detail: 'GET Route', doc: 'Defines a GET route handler.' },
        3: { detail: 'POST Route', doc: 'Defines a POST route handler.' },
        4: { detail: 'Function Definition', doc: 'Defines a new function using `fn`.' },
        5: { detail: 'Variable Declaration', doc: 'Declares a mutable variable.' },
        6: { detail: 'Constant Declaration', doc: 'Declares an immutable constant.' },
        7: { detail: 'Return Statement', doc: 'Returns a value from a function or route.' },
        8: { detail: 'Spawn Goroutine', doc: 'Spawns a new asynchronous task (Goroutine equivalent).' },
        9: { detail: 'If Statement', doc: 'Conditional logic block.' },
        10: { detail: 'Else Statement', doc: 'Fallback conditional logic block.' }
    };
    if (item.data && docs[item.data]) {
        item.detail = docs[item.data].detail;
        item.documentation = docs[item.data].doc;
    }
    return item;
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map
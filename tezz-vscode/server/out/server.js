"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager.
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
connection.onInitialize((params) => {
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true
            }
        }
    };
    return result;
});
connection.onInitialized(() => {
    connection.console.log('Tezz Language Server Initialized');
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});
async function validateTextDocument(textDocument) {
    const text = textDocument.getText();
    const pattern = /tezz/gi;
    let m;
    let problems = 0;
    const diagnostics = [];
    // Basic example diagnostic: highlight the word 'tezz' if used incorrectly (just for demo)
    // while ((m = pattern.exec(text))) {
    //   problems++;
    //   const diagnostic: Diagnostic = {
    //     severity: DiagnosticSeverity.Warning,
    //     range: {
    //       start: textDocument.positionAt(m.index),
    //       end: textDocument.positionAt(m.index + m[0].length)
    //     },
    //     message: `Tezz is case sensitive!`,
    //     source: 'tezz-lsp'
    //   };
    //   diagnostics.push(diagnostic);
    // }
    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    return [
        {
            label: 'service',
            kind: node_1.CompletionItemKind.Keyword,
            data: 1
        },
        {
            label: 'fn',
            kind: node_1.CompletionItemKind.Keyword,
            data: 2
        }
    ];
});
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = 'Service keyword';
        item.documentation = 'Defines an HTTP service block in Tezz.';
    }
    else if (item.data === 2) {
        item.detail = 'Function keyword';
        item.documentation = 'Defines a new function in Tezz.';
    }
    return item;
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map
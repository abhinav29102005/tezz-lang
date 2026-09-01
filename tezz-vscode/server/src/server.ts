import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult
} from 'vscode-languageserver/node';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

let Lexer: any;
let Parser: any;
try {
  const lexerModule = require('../../../src/lexer.js');
  const parserModule = require('../../../src/parser.js');
  Lexer = lexerModule.Lexer;
  Parser = parserModule.Parser;
} catch (e) {
  console.error("Failed to load Tezz compiler", e);
}

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
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

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  const text = textDocument.getText();
  const diagnostics: Diagnostic[] = [];

  if (Lexer && Parser) {
    try {
      const lexer = new Lexer(text);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      parser.parse(); // Throws on syntax error
    } catch (e: any) {
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
        } else {
            // Trim leading whitespace for better squiggle
            const trimmedMatch = lines[line].match(/^(\s+)/);
            if (trimmedMatch) {
                startChar = trimmedMatch[1].length;
            }
        }
        
        const diagnostic: Diagnostic = {
          severity: DiagnosticSeverity.Error,
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

connection.onCompletion(
  (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    return [
      { label: 'service', kind: CompletionItemKind.Keyword, data: 1 },
      { label: 'GET', kind: CompletionItemKind.Method, data: 2 },
      { label: 'POST', kind: CompletionItemKind.Method, data: 3 },
      { label: 'fn', kind: CompletionItemKind.Keyword, data: 4 },
      { label: 'let', kind: CompletionItemKind.Keyword, data: 5 },
      { label: 'const', kind: CompletionItemKind.Keyword, data: 6 },
      { label: 'return', kind: CompletionItemKind.Keyword, data: 7 },
      { label: 'spawn', kind: CompletionItemKind.Function, data: 8 },
      { label: 'if', kind: CompletionItemKind.Keyword, data: 9 },
      { label: 'else', kind: CompletionItemKind.Keyword, data: 10 }
    ];
  }
);

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    const docs: Record<number, {detail: string, doc: string}> = {
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
    if (item.data && docs[item.data as number]) {
      item.detail = docs[item.data as number].detail;
      item.documentation = docs[item.data as number].doc;
    }
    return item;
  }
);

documents.listen(connection);
connection.listen();

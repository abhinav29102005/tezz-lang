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

import { tezzKeywords } from './keywords';

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
    return tezzKeywords.map(k => ({
      label: k.label,
      kind: k.kind,
      data: k.data
    }));
  }
);

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    const keyword = tezzKeywords.find(k => k.data === item.data);
    if (keyword) {
      item.detail = keyword.detail;
      item.documentation = keyword.documentation;
    }
    return item;
  }
);

documents.listen(connection);
connection.listen();

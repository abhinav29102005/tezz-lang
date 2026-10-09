import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  CompletionItem,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  DocumentFormattingParams,
  TextEdit
} from 'vscode-languageserver/node';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

import { tezzKeywords } from './keywords';

let Lexer: any;
let Parser: any;
let formatCode: any;

function loadCompiler() {
  const tryRequire = (relPath: string) => {
    try {
      return require(relPath);
    } catch {
      return null;
    }
  };

  const lexerMod = tryRequire('./compiler/lexer.js') ||
                   tryRequire('../compiler/lexer.js') ||
                   tryRequire('../../../src/lexer.js');
  const parserMod = tryRequire('./compiler/parser.js') ||
                    tryRequire('../compiler/parser.js') ||
                    tryRequire('../../../src/parser.js');
  const formatterMod = tryRequire('./compiler/formatter.js') ||
                       tryRequire('../compiler/formatter.js') ||
                       tryRequire('../../../src/formatter.js');

  if (lexerMod) Lexer = lexerMod.Lexer;
  if (parserMod) Parser = parserMod.Parser;
  if (formatterMod) formatCode = formatterMod.format;
}

loadCompiler();

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((_params: InitializeParams): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true
      },
      documentFormattingProvider: true
    }
  };
});

connection.onInitialized(() => {
  connection.console.log('Tezz Language Server with Real Compiler & Formatter Integration Initialized');
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

connection.onDocumentFormatting((params: DocumentFormattingParams): TextEdit[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document || !formatCode) return [];
  const text = document.getText();
  try {
    const formatted = formatCode(text);
    if (formatted === text) return [];
    const fullRange = {
      start: { line: 0, character: 0 },
      end: { line: document.lineCount, character: 0 }
    };
    return [TextEdit.replace(fullRange, formatted)];
  } catch (e) {
    return [];
  }
});

documents.listen(connection);
connection.listen();

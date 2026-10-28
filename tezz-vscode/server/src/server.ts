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
  TextEdit,
  Hover,
  Definition,
  Range,
  Position
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
      documentFormattingProvider: true,
      hoverProvider: true,
      definitionProvider: true
    }
  };
});

connection.onInitialized(() => {
  connection.console.log('Tezz Language Server with Real Compiler, Formatter, Hover & Go-to-Definition Initialized');
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
        
        const expectedMatch = errorMessage.match(/Expected.*got '([^']+)'/i);
        if (expectedMatch && expectedMatch[1]) {
          const badToken = expectedMatch[1];
          const tokenIdx = lines[line].indexOf(badToken);
          if (tokenIdx !== -1) {
            startChar = tokenIdx;
            endChar = tokenIdx + badToken.length;
          }
        } else {
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

function getWordAtPosition(document: TextDocument, position: Position): { word: string, range: Range } | null {
  const text = document.getText();
  const offset = document.offsetAt(position);
  let start = offset;
  while (start > 0 && /[a-zA-Z0-9_]/.test(text.charAt(start - 1))) {
    start--;
  }
  let end = offset;
  while (end < text.length && /[a-zA-Z0-9_]/.test(text.charAt(end))) {
    end++;
  }
  if (start === end) return null;
  const word = text.slice(start, end);
  return {
    word,
    range: {
      start: document.positionAt(start),
      end: document.positionAt(end)
    }
  };
}

connection.onHover((params: TextDocumentPositionParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;
  const wordInfo = getWordAtPosition(document, params.position);
  if (!wordInfo) return null;
  const word = wordInfo.word;

  const keyword = tezzKeywords.find(k => k.label === word);
  if (keyword) {
    return {
      contents: {
        kind: 'markdown',
        value: `### ${keyword.detail}\n\n${keyword.documentation}`
      },
      range: wordInfo.range
    };
  }

  const text = document.getText();
  const fnRegex = new RegExp(`(?:fn|kaam|async\\s+fn|baadmein\\s+kaam)\\s+${word}\\s*\\(([^)]*)\\)(?:\\s*[:\\->]\\s*([a-zA-Z0-9_|\\[\\]\\s]+))?`, 'g');
  const fnMatch = fnRegex.exec(text);
  if (fnMatch) {
    const returnType = fnMatch[2] ? `: ${fnMatch[2].trim()}` : '';
    return {
      contents: {
        kind: 'markdown',
        value: `\`\`\`tezz\nfn ${word}(${fnMatch[1].trim()})${returnType}\n\`\`\`\n\n*User-defined function in Tezz*`
      },
      range: wordInfo.range
    };
  }

  const classRegex = new RegExp(`(?:class|dhancha)\\s+${word}(?:\\s+(?:extends|se_bana)\\s+([a-zA-Z0-9_]+))?`, 'g');
  const classMatch = classRegex.exec(text);
  if (classMatch) {
    const ext = classMatch[1] ? ` extends ${classMatch[1]}` : '';
    return {
      contents: {
        kind: 'markdown',
        value: `\`\`\`tezz\nclass ${word}${ext}\n\`\`\`\n\n*User-defined class in Tezz*`
      },
      range: wordInfo.range
    };
  }

  const svcRegex = new RegExp(`(?:service|seva)\\s+${word}\\s+on\\s+(\\d+)`, 'g');
  const svcMatch = svcRegex.exec(text);
  if (svcMatch) {
    return {
      contents: {
        kind: 'markdown',
        value: `\`\`\`tezz\nservice ${word} on ${svcMatch[1]}\n\`\`\`\n\n*Edge Service in Tezz*`
      },
      range: wordInfo.range
    };
  }

  return null;
});

connection.onDefinition((params: TextDocumentPositionParams): Definition | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;
  const wordInfo = getWordAtPosition(document, params.position);
  if (!wordInfo) return null;
  const word = wordInfo.word;

  const text = document.getText();
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const declPatterns = [
      new RegExp(`\\b(?:fn|kaam|async\\s+fn|baadmein\\s+kaam)\\s+(${word})\\b`),
      new RegExp(`\\b(?:class|dhancha)\\s+(${word})\\b`),
      new RegExp(`\\b(?:service|seva)\\s+(${word})\\b`),
      new RegExp(`\\b(?:trait|lakshan)\\s+(${word})\\b`),
      new RegExp(`\\b(?:let|const|rakho|pakka)\\s+(?:\\w+\\s*,\\s*)*(${word})\\b`)
    ];

    for (const pat of declPatterns) {
      const match = pat.exec(line);
      if (match) {
        const startChar = line.indexOf(word);
        return {
          uri: document.uri,
          range: {
            start: { line: i, character: startChar },
            end: { line: i, character: startChar + word.length }
          }
        };
      }
    }
  }

  return null;
});

documents.listen(connection);
connection.listen();

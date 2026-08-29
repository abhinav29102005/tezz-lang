// Tezz Language — Lexer (Tokenizer)
// Converts .tezz source code into a stream of tokens
// Supports both English AND Hinglish keywords

const TokenType = {
  // Literals
  NUMBER: 'NUMBER', STRING: 'STRING',
  IDENTIFIER: 'IDENTIFIER',

  // Keywords
  LET: 'LET', CONST: 'CONST', FN: 'FN', SERVICE: 'SERVICE', ROUTE: 'ROUTE',
  RESPOND: 'RESPOND', IF: 'IF', ELSE: 'ELSE', FOR: 'FOR',
  IN: 'IN', RETURN: 'RETURN', ON: 'ON',
  TRUE: 'TRUE', FALSE: 'FALSE', NULL: 'NULL',
  IMPORT: 'IMPORT', FROM: 'FROM', EXPORT: 'EXPORT',
  WHILE: 'WHILE', TRY: 'TRY', CATCH: 'CATCH',
  PRINT: 'PRINT', ASYNC: 'ASYNC', AWAIT: 'AWAIT',
  BACKGROUND: 'BACKGROUND', SPAWN: 'SPAWN',
  ENUM: 'ENUM', TRAIT: 'TRAIT', MACRO: 'MACRO',

  // Operators
  PLUS: 'PLUS', MINUS: 'MINUS', STAR: 'STAR', SLASH: 'SLASH', PERCENT: 'PERCENT',
  ASSIGN: 'ASSIGN', EQUALS: 'EQUALS', NOT_EQUALS: 'NOT_EQUALS',
  LESS: 'LESS', GREATER: 'GREATER', LESS_EQ: 'LESS_EQ', GREATER_EQ: 'GREATER_EQ',
  AND: 'AND', OR: 'OR', NOT: 'NOT',
  PLUS_ASSIGN: 'PLUS_ASSIGN', MINUS_ASSIGN: 'MINUS_ASSIGN',
  FAT_ARROW: 'FAT_ARROW',

  // Delimiters
  LPAREN: 'LPAREN', RPAREN: 'RPAREN',
  LBRACE: 'LBRACE', RBRACE: 'RBRACE',
  LBRACKET: 'LBRACKET', RBRACKET: 'RBRACKET',
  COMMA: 'COMMA', COLON: 'COLON', DOT: 'DOT', ARROW: 'ARROW',
  SEMICOLON: 'SEMICOLON',
  EOF: 'EOF',
};

// English + Hinglish keywords (both map to the SAME token types)
const KEYWORDS = {
  // English keywords
  'let': TokenType.LET, 'const': TokenType.CONST,
  'fn': TokenType.FN,
  'service': TokenType.SERVICE, 'route': TokenType.ROUTE,
  'respond': TokenType.RESPOND, 'if': TokenType.IF,
  'else': TokenType.ELSE, 'for': TokenType.FOR,
  'in': TokenType.IN, 'return': TokenType.RETURN,
  'on': TokenType.ON, 'true': TokenType.TRUE,
  'false': TokenType.FALSE, 'null': TokenType.NULL,
  'import': TokenType.IMPORT, 'from': TokenType.FROM,
  'export': TokenType.EXPORT,
  'while': TokenType.WHILE, 'try': TokenType.TRY, 'catch': TokenType.CATCH,
  'print': TokenType.PRINT, 'async': TokenType.ASYNC, 'await': TokenType.AWAIT,
  'background': TokenType.BACKGROUND,
  'spawn': TokenType.SPAWN,
  'enum': TokenType.ENUM,
  'trait': TokenType.TRAIT,
  'macro': TokenType.MACRO,

  // Hinglish keywords — same token types, different words
  'rakho': TokenType.LET,        // let = rakho (keep/store)
  'pakka': TokenType.CONST,      // const = pakka (permanent)
  'kaam': TokenType.FN,          // fn = kaam (work/task)
  'seva': TokenType.SERVICE,     // service = seva
  'rasta': TokenType.ROUTE,      // route = rasta (path)
  'jawab': TokenType.RESPOND,    // respond = jawab (answer)
  'agar': TokenType.IF,          // if = agar
  'warna': TokenType.ELSE,       // else = warna (otherwise)
  'har': TokenType.FOR,          // for = har (every/each)
  'mein': TokenType.IN,          // in = mein (inside)
  'vapas': TokenType.RETURN,     // return = vapas (back)
  'sahi': TokenType.TRUE,        // true = sahi (correct)
  'galat': TokenType.FALSE,      // false = galat (wrong)
  'khali': TokenType.NULL,       // null = khali (empty)
  'lao': TokenType.IMPORT,       // import = lao (bring)
  'bhejo': TokenType.EXPORT,     // export = bhejo (send)
  'jabtak': TokenType.WHILE,     // while = jabtak (as long as)
  'koshish': TokenType.TRY,      // try = koshish (attempt)
  'pakad': TokenType.CATCH,      // catch = pakad (grab)
  'dikha': TokenType.PRINT,      // print = dikha (show)
  'baadmein': TokenType.ASYNC,   // async = baadmein (later)
  'ruko': TokenType.AWAIT,       // await = ruko (wait)
  'piche_kam': TokenType.BACKGROUND, // background = piche_kam
  'paida_kar': TokenType.SPAWN,      // spawn = paida_kar
  'vikalp': TokenType.ENUM,          // enum = vikalp
  'lakshan': TokenType.TRAIT,        // trait = lakshan
  'jadoo': TokenType.MACRO,          // macro = jadoo
};

class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
  }

  peek() {
    return this.pos < this.source.length ? this.source[this.pos] : '\0';
  }

  peekNext() {
    return this.pos + 1 < this.source.length ? this.source[this.pos + 1] : '\0';
  }

  advance() {
    const ch = this.source[this.pos++];
    if (ch === '\n') { this.line++; this.column = 1; }
    else { this.column++; }
    return ch;
  }

  match(expected) {
    if (this.pos >= this.source.length || this.source[this.pos] !== expected) return false;
    this.advance();
    return true;
  }

  addToken(type, value) {
    this.tokens.push(new Token(type, value, this.line, this.column));
  }

  error(msg) {
    throw new Error(`[Tezz Lexer Error] Line ${this.line}, Col ${this.column}: ${msg}`);
  }

  tokenize() {
    while (this.pos < this.source.length) {
      const ch = this.advance();

      if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n') continue;

      if (ch === '(') { this.addToken(TokenType.LPAREN, '('); continue; }
      if (ch === ')') { this.addToken(TokenType.RPAREN, ')'); continue; }
      if (ch === '{') { this.addToken(TokenType.LBRACE, '{'); continue; }
      if (ch === '}') { this.addToken(TokenType.RBRACE, '}'); continue; }
      if (ch === '[') { this.addToken(TokenType.LBRACKET, '['); continue; }
      if (ch === ']') { this.addToken(TokenType.RBRACKET, ']'); continue; }
      if (ch === ',') { this.addToken(TokenType.COMMA, ','); continue; }
      if (ch === ':') { this.addToken(TokenType.COLON, ':'); continue; }
      if (ch === '.') { this.addToken(TokenType.DOT, '.'); continue; }
      if (ch === ';') { this.addToken(TokenType.SEMICOLON, ';'); continue; }
      if (ch === '*') { this.addToken(TokenType.STAR, '*'); continue; }
      if (ch === '/') { this.addToken(TokenType.SLASH, '/'); continue; }
      if (ch === '%') { this.addToken(TokenType.PERCENT, '%'); continue; }

      if (ch === '+') {
        if (this.match('=')) { this.addToken(TokenType.PLUS_ASSIGN, '+='); }
        else { this.addToken(TokenType.PLUS, '+'); }
        continue;
      }

      if (ch === '-') {
        if (this.match('-')) {
          // Comment: -- until end of line
          while (this.pos < this.source.length && this.peek() !== '\n') this.advance();
        } else if (this.match('>')) {
          this.addToken(TokenType.ARROW, '->');
        } else if (this.match('=')) {
          this.addToken(TokenType.MINUS_ASSIGN, '-=');
        } else {
          this.addToken(TokenType.MINUS, '-');
        }
        continue;
      }

      if (ch === '=') {
        if (this.match('=')) { this.addToken(TokenType.EQUALS, '=='); }
        else if (this.match('>')) { this.addToken(TokenType.FAT_ARROW, '=>'); }
        else { this.addToken(TokenType.ASSIGN, '='); }
        continue;
      }

      if (ch === '!') {
        if (this.match('=')) { this.addToken(TokenType.NOT_EQUALS, '!='); }
        else { this.addToken(TokenType.NOT, '!'); }
        continue;
      }

      if (ch === '<') {
        if (this.match('=')) { this.addToken(TokenType.LESS_EQ, '<='); }
        else { this.addToken(TokenType.LESS, '<'); }
        continue;
      }

      if (ch === '>') {
        if (this.match('=')) { this.addToken(TokenType.GREATER_EQ, '>='); }
        else { this.addToken(TokenType.GREATER, '>'); }
        continue;
      }

      if (ch === '&') {
        if (this.match('&')) { this.addToken(TokenType.AND, '&&'); }
        else { this.error("Unexpected '&'. Did you mean '&&'?"); }
        continue;
      }

      if (ch === '|') {
        if (this.match('|')) { this.addToken(TokenType.OR, '||'); }
        else { this.error("Unexpected '|'. Did you mean '||'?"); }
        continue;
      }

      if (ch === '"') { this.scanString(); continue; }

      if (/[0-9]/.test(ch)) { this.scanNumber(ch); continue; }
      if (/[a-zA-Z_]/.test(ch)) { this.scanIdentifier(ch); continue; }

      this.error(`Unexpected character '${ch}'`);
    }

    this.tokens.push(new Token(TokenType.EOF, null, this.line, this.column));
    return this.tokens;
  }

  scanString() {
    let value = '';
    const startLine = this.line;
    while (this.pos < this.source.length && this.peek() !== '"') {
      if (this.peek() === '\\') {
        this.advance();
        const esc = this.advance();
        if (esc === 'n') value += '\n';
        else if (esc === 't') value += '\t';
        else if (esc === 'r') value += '\r';
        else if (esc === '"') value += '"';
        else if (esc === '\\') value += '\\';
        else value += esc;
      } else {
        value += this.advance();
      }
    }
    if (this.pos >= this.source.length) this.error(`Unterminated string starting at line ${startLine}`);
    this.advance(); // closing "
    this.addToken(TokenType.STRING, value);
  }

  scanNumber(first) {
    let value = first;
    while (this.pos < this.source.length && /[0-9]/.test(this.peek())) value += this.advance();
    if (this.peek() === '.' && /[0-9]/.test(this.peekNext())) {
      value += this.advance();
      while (this.pos < this.source.length && /[0-9]/.test(this.peek())) value += this.advance();
    }
    this.addToken(TokenType.NUMBER, parseFloat(value));
  }

  scanIdentifier(first) {
    let value = first;
    while (this.pos < this.source.length && /[a-zA-Z0-9_]/.test(this.peek())) value += this.advance();
    this.addToken(KEYWORDS[value] || TokenType.IDENTIFIER, value);
  }
}

module.exports = { Lexer, Token, TokenType, KEYWORDS };

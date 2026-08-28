// ⚡ Tezz Language — Parser
// Converts token stream into an Abstract Syntax Tree (AST)
// Uses recursive descent parsing with operator precedence climbing

const { TokenType } = require('./lexer');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  // --- Utility methods ---

  peek()    { return this.tokens[this.pos]; }
  advance() { return this.tokens[this.pos++]; }
  isAtEnd() { return this.peek().type === TokenType.EOF; }

  check(type) { return this.peek().type === type; }

  expect(type) {
    if (!this.check(type)) {
      const t = this.peek();
      this.error(`Expected ${type}, got ${t.type} ('${t.value}')`, t.line);
    }
    return this.advance();
  }

  error(msg, line) {
    const l = line || (this.peek() && this.peek().line) || '?';
    throw new Error(`[Tezz Parser Error] Line ${l}: ${msg}`);
  }

  // === ENTRY POINT ===

  parse() {
    const body = [];
    while (!this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    return { type: 'Program', body };
  }

  // === STATEMENTS ===

  parseStatement() {
    switch (this.peek().type) {
      case TokenType.LET:     return this.parseLetDecl();
      case TokenType.FN:      return this.parseFnDecl();
      case TokenType.SERVICE: return this.parseServiceDecl();
      case TokenType.ROUTE:   return this.parseRouteDecl();
      case TokenType.RESPOND: return this.parseRespondStmt();
      case TokenType.RETURN:  return this.parseReturnStmt();
      case TokenType.IF:      return this.parseIfStmt();
      case TokenType.FOR:     return this.parseForStmt();
      case TokenType.IMPORT:  return this.parseImportStmt();
      case TokenType.EXPORT:  return this.parseExportStmt();
      default:                return this.parseExprStmt();
    }
  }

  // let name = expression
  parseLetDecl() {
    const line = this.peek().line;
    this.expect(TokenType.LET);
    const name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.ASSIGN);
    const value = this.parseExpression();
    return { type: 'VariableDeclaration', name, value, line };
  }

  // fn name(params) -> returnType { body }
  parseFnDecl() {
    const line = this.peek().line;
    this.expect(TokenType.FN);
    const name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.LPAREN);
    const params = this.parseParamList();
    this.expect(TokenType.RPAREN);

    let returnType = null;
    if (this.check(TokenType.ARROW)) {
      this.advance();
      returnType = this.expect(TokenType.IDENTIFIER).value;
    }

    const body = this.parseBlock();
    return { type: 'FunctionDeclaration', name, params, returnType, body, line };
  }

  parseParamList() {
    const params = [];
    if (this.check(TokenType.RPAREN)) return params;
    do {
      const name = this.expect(TokenType.IDENTIFIER).value;
      let paramType = null;
      if (this.check(TokenType.COLON)) {
        this.advance();
        paramType = this.expect(TokenType.IDENTIFIER).value;
      }
      params.push({ name, paramType });
    } while (this.check(TokenType.COMMA) && this.advance());
    return params;
  }

  // service Name on port { routes }
  parseServiceDecl() {
    const line = this.peek().line;
    this.expect(TokenType.SERVICE);
    const name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.ON);
    const port = this.parseExpression();
    this.expect(TokenType.LBRACE);
    const routes = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.check(TokenType.ROUTE)) {
        routes.push(this.parseRouteDecl());
      } else {
        routes.push(this.parseStatement());
      }
    }
    this.expect(TokenType.RBRACE);
    return { type: 'ServiceDeclaration', name, port, routes, line };
  }

  // route GET "/path" { body }
  parseRouteDecl() {
    const line = this.peek().line;
    this.expect(TokenType.ROUTE);
    const method = this.expect(TokenType.IDENTIFIER).value.toUpperCase();
    const path = this.expect(TokenType.STRING).value;
    const body = this.parseBlock();
    return { type: 'RouteDeclaration', method, path, body, line };
  }

  // respond 200 { key: value }
  parseRespondStmt() {
    const line = this.peek().line;
    this.expect(TokenType.RESPOND);
    let status = null;
    if (this.check(TokenType.NUMBER)) {
      status = this.advance().value;
    }
    const body = this.parseExpression();
    return { type: 'RespondStatement', status, body, line };
  }

  // return expression?
  parseReturnStmt() {
    const line = this.peek().line;
    this.expect(TokenType.RETURN);
    let value = null;
    if (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const next = this.peek().type;
      const stmtStarters = [TokenType.LET, TokenType.FN, TokenType.SERVICE,
        TokenType.ROUTE, TokenType.IF, TokenType.FOR, TokenType.RESPOND, TokenType.RETURN];
      if (!stmtStarters.includes(next)) {
        value = this.parseExpression();
      }
    }
    return { type: 'ReturnStatement', value, line };
  }

  // if condition { body } else { body }
  parseIfStmt() {
    const line = this.peek().line;
    this.expect(TokenType.IF);
    const condition = this.parseExpression();
    const consequent = this.parseBlock();
    let alternate = null;
    if (this.check(TokenType.ELSE)) {
      this.advance();
      alternate = this.check(TokenType.IF) ? this.parseIfStmt() : this.parseBlock();
    }
    return { type: 'IfStatement', condition, consequent, alternate, line };
  }

  // for item in iterable { body }
  parseForStmt() {
    const line = this.peek().line;
    this.expect(TokenType.FOR);
    const variable = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.IN);
    const iterable = this.parseExpression();
    const body = this.parseBlock();
    return { type: 'ForStatement', variable, iterable, body, line };
  }

  // import name from "source"
  parseImportStmt() {
    const line = this.peek().line;
    this.expect(TokenType.IMPORT);
    const name = this.expect(TokenType.IDENTIFIER).value;
    this.expect(TokenType.FROM);
    const source = this.expect(TokenType.STRING).value;
    return { type: 'ImportStatement', name, source, line };
  }

  // export statement
  parseExportStmt() {
    const line = this.peek().line;
    this.expect(TokenType.EXPORT);
    const declaration = this.parseStatement();
    return { type: 'ExportStatement', declaration, line };
  }

  // { statements }
  parseBlock() {
    this.expect(TokenType.LBRACE);
    const body = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      body.push(this.parseStatement());
    }
    this.expect(TokenType.RBRACE);
    return body;
  }

  parseExprStmt() {
    const line = this.peek().line;
    const expression = this.parseExpression();
    return { type: 'ExpressionStatement', expression, line };
  }

  // === EXPRESSIONS (Precedence Climbing) ===

  parseExpression() { return this.parseAssignment(); }

  parseAssignment() {
    const expr = this.parseOr();
    if (this.check(TokenType.ASSIGN)) {
      this.advance();
      const value = this.parseAssignment();
      return { type: 'AssignmentExpression', target: expr, value };
    }
    return expr;
  }

  parseOr() {
    let left = this.parseAnd();
    while (this.check(TokenType.OR)) {
      this.advance();
      left = { type: 'BinaryExpression', operator: '||', left, right: this.parseAnd() };
    }
    return left;
  }

  parseAnd() {
    let left = this.parseEquality();
    while (this.check(TokenType.AND)) {
      this.advance();
      left = { type: 'BinaryExpression', operator: '&&', left, right: this.parseEquality() };
    }
    return left;
  }

  parseEquality() {
    let left = this.parseComparison();
    while (this.check(TokenType.EQUALS) || this.check(TokenType.NOT_EQUALS)) {
      const op = this.advance().value;
      left = { type: 'BinaryExpression', operator: op, left, right: this.parseComparison() };
    }
    return left;
  }

  parseComparison() {
    let left = this.parseAddition();
    while (this.check(TokenType.LESS) || this.check(TokenType.GREATER) ||
           this.check(TokenType.LESS_EQ) || this.check(TokenType.GREATER_EQ)) {
      const op = this.advance().value;
      left = { type: 'BinaryExpression', operator: op, left, right: this.parseAddition() };
    }
    return left;
  }

  parseAddition() {
    let left = this.parseMultiplication();
    while (this.check(TokenType.PLUS) || this.check(TokenType.MINUS)) {
      const op = this.advance().value;
      left = { type: 'BinaryExpression', operator: op, left, right: this.parseMultiplication() };
    }
    return left;
  }

  parseMultiplication() {
    let left = this.parseUnary();
    while (this.check(TokenType.STAR) || this.check(TokenType.SLASH) || this.check(TokenType.PERCENT)) {
      const op = this.advance().value;
      left = { type: 'BinaryExpression', operator: op, left, right: this.parseUnary() };
    }
    return left;
  }

  parseUnary() {
    if (this.check(TokenType.NOT) || this.check(TokenType.MINUS)) {
      const op = this.advance().value;
      return { type: 'UnaryExpression', operator: op, operand: this.parseUnary() };
    }
    return this.parseCall();
  }

  parseCall() {
    let expr = this.parsePrimary();
    while (true) {
      if (this.check(TokenType.LPAREN)) {
        this.advance();
        const args = [];
        if (!this.check(TokenType.RPAREN)) {
          do { args.push(this.parseExpression()); }
          while (this.check(TokenType.COMMA) && this.advance());
        }
        this.expect(TokenType.RPAREN);
        expr = { type: 'CallExpression', callee: expr, arguments: args };
      } else if (this.check(TokenType.DOT)) {
        this.advance();
        const prop = this.expect(TokenType.IDENTIFIER).value;
        expr = { type: 'MemberExpression', object: expr, property: prop };
      } else if (this.check(TokenType.LBRACKET)) {
        this.advance();
        const index = this.parseExpression();
        this.expect(TokenType.RBRACKET);
        expr = { type: 'IndexExpression', object: expr, index };
      } else {
        break;
      }
    }
    return expr;
  }

  parsePrimary() {
    const token = this.peek();

    switch (token.type) {
      case TokenType.NUMBER:
        this.advance();
        return { type: 'NumberLiteral', value: token.value };

      case TokenType.STRING:
        this.advance();
        return { type: 'StringLiteral', value: token.value };

      case TokenType.TRUE:
        this.advance();
        return { type: 'BooleanLiteral', value: true };

      case TokenType.FALSE:
        this.advance();
        return { type: 'BooleanLiteral', value: false };

      case TokenType.NULL:
        this.advance();
        return { type: 'NullLiteral', value: null };

      case TokenType.IDENTIFIER:
        this.advance();
        return { type: 'Identifier', name: token.value };

      case TokenType.LPAREN: {
        this.advance();
        const expr = this.parseExpression();
        this.expect(TokenType.RPAREN);
        return expr;
      }

      case TokenType.LBRACKET:
        return this.parseArrayLiteral();

      case TokenType.LBRACE:
        return this.parseObjectLiteral();

      default:
        this.error(`Unexpected token ${token.type} ('${token.value}')`, token.line);
    }
  }

  parseArrayLiteral() {
    this.expect(TokenType.LBRACKET);
    const elements = [];
    if (!this.check(TokenType.RBRACKET)) {
      do { elements.push(this.parseExpression()); }
      while (this.check(TokenType.COMMA) && this.advance());
    }
    this.expect(TokenType.RBRACKET);
    return { type: 'ArrayLiteral', elements };
  }

  // Check if a token can be used as an object key (identifiers + keywords)
  isKeyLike(token) {
    return token.type === TokenType.IDENTIFIER ||
           token.type === TokenType.STRING ||
           token.type === TokenType.LET ||
           token.type === TokenType.FN ||
           token.type === TokenType.SERVICE ||
           token.type === TokenType.ROUTE ||
           token.type === TokenType.RESPOND ||
           token.type === TokenType.IF ||
           token.type === TokenType.ELSE ||
           token.type === TokenType.FOR ||
           token.type === TokenType.IN ||
           token.type === TokenType.RETURN ||
           token.type === TokenType.ON ||
           token.type === TokenType.TRUE ||
           token.type === TokenType.FALSE ||
           token.type === TokenType.NULL ||
           token.type === TokenType.IMPORT ||
           token.type === TokenType.FROM ||
           token.type === TokenType.EXPORT;
  }

  parseObjectLiteral() {
    this.expect(TokenType.LBRACE);
    const properties = [];
    if (!this.check(TokenType.RBRACE)) {
      do {
        // Support identifiers, strings, AND keywords as object keys
        const token = this.peek();
        let key;
        if (this.isKeyLike(token)) {
          key = this.advance().value;
        } else {
          this.error(`Expected object key, got ${token.type} ('${token.value}')`, token.line);
        }
        this.expect(TokenType.COLON);
        const value = this.parseExpression();
        properties.push({ key, value });
      } while (this.check(TokenType.COMMA) && this.advance());
    }
    this.expect(TokenType.RBRACE);
    return { type: 'ObjectLiteral', properties };
  }
}

module.exports = { Parser };

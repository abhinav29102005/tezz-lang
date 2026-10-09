// Tezz Language — Code Formatter (tezz fmt)
// Formats Tezz source code with canonical 2-space indentation, consistent operator spacing,
// clean braces, and preserved comments.

const { Lexer } = require('./lexer');
const { Parser } = require('./parser');

class Formatter {
  constructor(options = {}) {
    this.indentSize = options.indentSize || 2;
  }

  // Tokenize source into formatting tokens preserving comments and newlines
  tokenize(source) {
    const tokens = [];
    let i = 0;
    const len = source.length;

    while (i < len) {
      const ch = source[i];

      // Newlines
      if (ch === '\r') {
        i++;
        continue;
      }
      if (ch === '\n') {
        tokens.push({ type: 'NEWLINE', value: '\n' });
        i++;
        continue;
      }

      // Whitespace (horizontal)
      if (ch === ' ' || ch === '\t') {
        let ws = '';
        while (i < len && (source[i] === ' ' || source[i] === '\t')) {
          ws += source[i++];
        }
        tokens.push({ type: 'WHITESPACE', value: ws });
        continue;
      }

      // Comments: -- until end of line
      if (ch === '-' && i + 1 < len && source[i + 1] === '-') {
        let comment = '';
        while (i < len && source[i] !== '\n' && source[i] !== '\r') {
          comment += source[i++];
        }
        tokens.push({ type: 'COMMENT', value: comment });
        continue;
      }

      // Strings (double quotes)
      if (ch === '"') {
        let str = ch;
        i++;
        while (i < len && source[i] !== '"') {
          if (source[i] === '\\' && i + 1 < len) {
            str += source[i++];
          }
          str += source[i++];
        }
        if (i < len) str += source[i++]; // include closing "
        tokens.push({ type: 'STRING', value: str });
        continue;
      }

      // Multi-char operators
      const two = source.substring(i, i + 2);
      if (['==', '!=', '<=', '>=', '+=', '-=', '->', '=>', '&&', '||', '..'].includes(two)) {
        tokens.push({ type: 'OPERATOR', value: two });
        i += 2;
        continue;
      }

      // Single char operators / punctuation
      if ('{}()[],;.'.includes(ch)) {
        tokens.push({ type: 'PUNCTUATION', value: ch });
        i++;
        continue;
      }

      if (':+-*/%=!<>'.includes(ch)) {
        tokens.push({ type: 'OPERATOR', value: ch });
        i++;
        continue;
      }

      // Identifiers / numbers / keywords
      let word = '';
      while (i < len && !/[\s\r\n{}()[\];,:+*\/%=!<>.&|"]/.test(source[i])) {
        // Stop if comment start
        if (source[i] === '-' && i + 1 < len && source[i + 1] === '-') break;
        word += source[i++];
      }
      if (word.length > 0) {
        tokens.push({ type: 'WORD', value: word });
      }
    }

    return tokens;
  }

  // Format the source code string
  format(source) {
    const rawTokens = this.tokenize(source);

    // Group tokens into lines
    const lines = [];
    let currentLine = [];

    for (let i = 0; i < rawTokens.length; i++) {
      const tok = rawTokens[i];
      if (tok.type === 'NEWLINE') {
        lines.push(currentLine);
        currentLine = [];
      } else {
        currentLine.push(tok);
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    let indentLevel = 0;
    const formattedLines = [];

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const rawLineTokens = lines[lineIdx];

      // Filter out leading/trailing whitespace tokens
      const nonWsTokens = rawLineTokens.filter(t => t.type !== 'WHITESPACE');

      if (nonWsTokens.length === 0) {
        // Blank line: keep at most one consecutive blank line
        if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
          formattedLines.push('');
        }
        continue;
      }

      // If the line starts with a closing brace '}' or ']', decrease indent for this line
      const firstTok = nonWsTokens[0];
      let decreasesOnLineStart = 0;
      if (firstTok.value === '}' || firstTok.value === ']') {
        decreasesOnLineStart = 1;
      }

      const effectiveIndent = Math.max(0, indentLevel - decreasesOnLineStart);
      const indentStr = ' '.repeat(effectiveIndent * this.indentSize);

      // Build formatted line content
      let lineText = '';
      for (let t = 0; t < nonWsTokens.length; t++) {
        const prev = nonWsTokens[t - 1];
        const cur = nonWsTokens[t];
        const next = nonWsTokens[t + 1];

        lineText += cur.value;

        if (!next) continue;

        // Spacing rules between cur and next:
        const curVal = cur.value;
        const nextVal = next.value;

        // Empty braces or brackets: no space inside (e.g. {} and [])
        if (curVal === '{' && nextVal === '}') {
          continue;
        }
        if (curVal === '[' && nextVal === ']') {
          continue;
        }

        // No space after opening paren/bracket: (, [
        if (curVal === '(' || curVal === '[') {
          continue;
        }

        // No space before closing paren/bracket: ), ], comma, semicolon
        if (nextVal === ')' || nextVal === ']' || nextVal === ',' || nextVal === ';') {
          continue;
        }

        // Comma or semicolon: always 1 space after
        if (curVal === ',' || curVal === ';') {
          lineText += ' ';
          continue;
        }

        // Colon ':':
        if (curVal === ':') {
          lineText += ' ';
          continue;
        }
        if (nextVal === ':') {
          // No space before colon in { key: val } or param: type
          continue;
        }

        // Dot operator: no space around '.' (e.g. obj.prop, 3.14)
        if (curVal === '.' || nextVal === '.') {
          continue;
        }

        // Range operator '..' has no spaces around it (e.g. 1..10)
        if (curVal === '..' || nextVal === '..') {
          continue;
        }

        // Unary NOT '!' has no space after: !name
        if (curVal === '!') {
          continue;
        }

        // Macro invocation: '!' followed by '(' or '[' has no space: log_status!(...) or vec![...]
        if (curVal.endsWith('!') && (nextVal === '(' || nextVal === '[')) {
          continue;
        }

        // Unary minus: attach directly to operand if preceded by operator, delimiter, or return
        const isUnaryMinus = curVal === '-' && (
          !prev ||
          prev.type === 'OPERATOR' ||
          ['(', '[', '{', ',', ':', ';'].includes(prev.value) ||
          (prev.type === 'WORD' && ['return', 'vapas', 'yield', 'throw', 'case'].includes(prev.value))
        );
        if (isUnaryMinus) {
          continue;
        }

        // Binary operators: 1 space before and after
        const isCurOp = cur.type === 'OPERATOR';
        const isNextOp = next.type === 'OPERATOR';

        // When next is unary minus after an operator: keep 1 space after cur operator (e.g. `x = -5`)
        if (nextVal === '-' && isCurOp) {
          lineText += ' ';
          continue;
        }

        if (isCurOp || isNextOp) {
          lineText += ' ';
          continue;
        }

        // Control flow keywords: 1 space before '(' (e.g. if (x), agar (x), while (true), har (x))
        const controlKeywords = [
          'if', 'agar', 'while', 'jabtak', 'for', 'har',
          'catch', 'pakad', 'switch', 'koshish'
        ];
        if (cur.type === 'WORD' && controlKeywords.includes(cur.value) && nextVal === '(') {
          lineText += ' ';
          continue;
        }

        // Index access: no space before '[' (e.g. users[0], matrix[i][j], getList()[0])
        const arrayExprKeywords = ['return', 'vapas', 'in', 'mein', 'case', 'yield', 'typeof'];
        if ((cur.type === 'WORD' && !arrayExprKeywords.includes(cur.value) && nextVal === '[') ||
            (curVal === ']' && nextVal === '[') ||
            (curVal === ')' && nextVal === '[')) {
          continue;
        }

        // Function call: no space between name and '('
        if (cur.type === 'WORD' && nextVal === '(') {
          continue;
        }

        // Space before opening brace '{'
        if (nextVal === '{') {
          lineText += ' ';
          continue;
        }

        // Space before comments
        if (next.type === 'COMMENT') {
          lineText += '  ';
          continue;
        }

        // Default between words/tokens
        lineText += ' ';
      }

      // Attach control flow braces on same line: e.g. '} else {' or '} catch err {'
      lineText = lineText.replace(/^}\s+(else|warna|catch|pakad)/, '} $1');

      // Cuddle control flow braces if previous line was a standalone closing brace '}'
      let cuddled = false;
      if (['else', 'warna', 'catch', 'pakad'].includes(firstTok.value)) {
        if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
          formattedLines.pop();
        }
        if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1].trim() === '}') {
          const prevLine = formattedLines.pop();
          formattedLines.push(prevLine + ' ' + lineText);
          cuddled = true;
        }
      }

      if (!cuddled) {
        formattedLines.push(indentStr + lineText);
      }

      // Adjust indentation for following lines based on braces on this line
      for (const tok of nonWsTokens) {
        if (tok.value === '{' || tok.value === '[') {
          indentLevel++;
        } else if (tok.value === '}' || tok.value === ']') {
          if (tok === firstTok) {
            // Already accounted for by decreasesOnLineStart
            indentLevel = Math.max(0, indentLevel - 1);
          } else {
            indentLevel = Math.max(0, indentLevel - 1);
          }
        }
      }
    }

    // Trim trailing blank lines and guarantee single ending newline
    while (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] === '') {
      formattedLines.pop();
    }

    return formattedLines.join('\n') + '\n';
  }

  // Safe format with AST validation check
  formatSafe(source, filename = 'code.tezz') {
    const formatted = this.format(source);

    // Validate original syntax first
    try {
      const origTokens = new Lexer(source).tokenize();
      new Parser(origTokens).parse();
    } catch (origErr) {
      throw new Error(`[Tezz Formatter Error] Cannot format ${filename} because it contains syntax errors: ${origErr.message}`);
    }

    // Validate formatted output parses identically
    try {
      const fmtTokens = new Lexer(formatted).tokenize();
      new Parser(fmtTokens).parse();
    } catch (fmtErr) {
      throw new Error(`[Tezz Formatter Error] Safety validation failed! Formatted output broke syntax in ${filename}: ${fmtErr.message}`);
    }

    return formatted;
  }
}

module.exports = { Formatter };

// Tezz Language — Type Checker & Semantic Validator
// Validates compile-time type safety and interface/trait contracts

class TypeChecker {
  constructor(ast, options = {}) {
    this.ast = ast;
    this.options = options; // { strict: boolean }
    this.traits = new Map(); // name -> TraitDeclaration
    this.classes = new Map(); // name -> ClassDeclaration
    this.errors = [];
  }

  check() {
    this.collectDeclarations();
    this.validateTraits();
    this.validateVariables();
    
    if (this.errors.length > 0) {
      const first = this.errors[0];
      const err = new TypeError(first.message);
      err.line = first.line;
      err.allErrors = this.errors;
      throw err;
    }

    return true;
  }

  collectDeclarations() {
    for (const stmt of this.ast.body) {
      if (stmt.type === 'TraitDeclaration') {
        this.traits.set(stmt.name, stmt);
      } else if (stmt.type === 'ClassDeclaration') {
        this.classes.set(stmt.name, stmt);
      }
    }
  }

  validateTraits() {
    for (const cls of this.classes.values()) {
      if (!cls.implements || cls.implements.length === 0) continue;

      for (const traitName of cls.implements) {
        const trait = this.traits.get(traitName);
        if (!trait) continue; // Trait may be imported from another module

        for (const reqMethod of trait.methods) {
          const implemented = cls.methods.find(m => m.name === reqMethod.name);
          if (!implemented) {
            this.errors.push({
              line: cls.line,
              message: `[Tezz Type Error] Line ${cls.line}: Class '${cls.name}' implements trait '${traitName}', but is missing required method '${reqMethod.name}()'`
            });
          }
        }
      }
    }
  }

  validateVariables() {
    const checkStmt = (stmt) => {
      if (!stmt) return;

      if (stmt.type === 'VariableDeclaration' && stmt.typeAnn && stmt.value) {
        const expected = stmt.typeAnn.toLowerCase().trim();
        const val = stmt.value;

        if (['int', 'float', 'number'].includes(expected)) {
          if (val.type === 'StringLiteral') {
            this.errors.push({
              line: stmt.line,
              message: `[Tezz Type Error] Line ${stmt.line}: Cannot assign string "${val.value}" to variable '${stmt.name}' of type '${stmt.typeAnn}'`
            });
          } else if (val.type === 'BooleanLiteral') {
            this.errors.push({
              line: stmt.line,
              message: `[Tezz Type Error] Line ${stmt.line}: Cannot assign boolean '${val.value}' to variable '${stmt.name}' of type '${stmt.typeAnn}'`
            });
          }
        } else if (expected === 'string') {
          if (val.type === 'NumberLiteral') {
            this.errors.push({
              line: stmt.line,
              message: `[Tezz Type Error] Line ${stmt.line}: Cannot assign number ${val.value} to variable '${stmt.name}' of type 'string'`
            });
          } else if (val.type === 'BooleanLiteral') {
            this.errors.push({
              line: stmt.line,
              message: `[Tezz Type Error] Line ${stmt.line}: Cannot assign boolean '${val.value}' to variable '${stmt.name}' of type 'string'`
            });
          }
        } else if (['bool', 'boolean'].includes(expected)) {
          if (val.type === 'NumberLiteral' || val.type === 'StringLiteral') {
            this.errors.push({
              line: stmt.line,
              message: `[Tezz Type Error] Line ${stmt.line}: Cannot assign non-boolean value to variable '${stmt.name}' of type '${stmt.typeAnn}'`
            });
          }
        }
      }

      // Check inner blocks
      if (stmt.body && Array.isArray(stmt.body)) {
        for (const s of stmt.body) checkStmt(s);
      }
      if (stmt.methods) {
        for (const m of stmt.methods) {
          if (m.body && Array.isArray(m.body)) {
            for (const s of m.body) checkStmt(s);
          }
        }
      }
    };

    for (const stmt of this.ast.body) {
      checkStmt(stmt);
    }
  }
}

function checkTypes(ast, options = {}) {
  const checker = new TypeChecker(ast, options);
  return checker.check();
}

module.exports = { TypeChecker, checkTypes };

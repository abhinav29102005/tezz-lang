// Tezz Language — Validator (tezz-validator)
// Lightweight schema validation with detailed error reporting

class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class BaseType {
  constructor() {
    this._optional = false;
    this._customCheck = null;
  }

  optional() {
    this._optional = true;
    return this;
  }

  custom(fn, message = 'Custom validation failed') {
    this._customCheck = { fn, message };
    return this;
  }
}

class StringType extends BaseType {
  constructor() {
    super();
    this.type = 'string';
    this._min = null;
    this._max = null;
    this._regex = null;
    this._email = false;
  }

  min(len) { this._min = len; return this; }
  max(len) { this._max = len; return this; }
  regex(pattern, message) { this._regex = { pattern, message }; return this; }
  email() { this._email = true; return this; }

  _validate(val, path = '') {
    const errs = [];
    if (val === undefined || val === null) {
      if (!this._optional) errs.push({ path, message: 'Required field is missing' });
      return errs;
    }
    if (typeof val !== 'string') {
      errs.push({ path, message: `Expected string, got ${typeof val}` });
      return errs;
    }
    if (this._min !== null && val.length < this._min) {
      errs.push({ path, message: `String must be at least ${this._min} characters long` });
    }
    if (this._max !== null && val.length > this._max) {
      errs.push({ path, message: `String must be at most ${this._max} characters long` });
    }
    if (this._email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errs.push({ path, message: 'Invalid email address' });
    }
    if (this._regex && !this._regex.pattern.test(val)) {
      errs.push({ path, message: this._regex.message || 'String does not match pattern' });
    }
    if (this._customCheck && !this._customCheck.fn(val)) {
      errs.push({ path, message: this._customCheck.message });
    }
    return errs;
  }
}

class NumberType extends BaseType {
  constructor() {
    super();
    this.type = 'number';
    this._min = null;
    this._max = null;
    this._int = false;
    this._positive = false;
  }

  min(n) { this._min = n; return this; }
  max(n) { this._max = n; return this; }
  int() { this._int = true; return this; }
  positive() { this._positive = true; return this; }

  _validate(val, path = '') {
    const errs = [];
    if (val === undefined || val === null) {
      if (!this._optional) errs.push({ path, message: 'Required field is missing' });
      return errs;
    }
    if (typeof val !== 'number' || isNaN(val)) {
      errs.push({ path, message: `Expected number, got ${typeof val}` });
      return errs;
    }
    if (this._int && !Number.isInteger(val)) {
      errs.push({ path, message: 'Number must be an integer' });
    }
    if (this._positive && val <= 0) {
      errs.push({ path, message: 'Number must be positive' });
    }
    if (this._min !== null && val < this._min) {
      errs.push({ path, message: `Number must be >= ${this._min}` });
    }
    if (this._max !== null && val > this._max) {
      errs.push({ path, message: `Number must be <= ${this._max}` });
    }
    if (this._customCheck && !this._customCheck.fn(val)) {
      errs.push({ path, message: this._customCheck.message });
    }
    return errs;
  }
}

class BooleanType extends BaseType {
  constructor() {
    super();
    this.type = 'boolean';
  }

  _validate(val, path = '') {
    const errs = [];
    if (val === undefined || val === null) {
      if (!this._optional) errs.push({ path, message: 'Required field is missing' });
      return errs;
    }
    if (typeof val !== 'boolean') {
      errs.push({ path, message: `Expected boolean, got ${typeof val}` });
    }
    return errs;
  }
}

class ObjectType extends BaseType {
  constructor(schema = {}) {
    super();
    this.type = 'object';
    this.schema = schema;
  }

  _validate(val, path = '') {
    const errs = [];
    if (val === undefined || val === null) {
      if (!this._optional) errs.push({ path, message: 'Required field is missing' });
      return errs;
    }
    if (typeof val !== 'object' || Array.isArray(val)) {
      errs.push({ path, message: `Expected object, got ${Array.isArray(val) ? 'array' : typeof val}` });
      return errs;
    }
    for (const key of Object.keys(this.schema)) {
      const fieldPath = path ? `${path}.${key}` : key;
      const validator = this.schema[key];
      if (validator && typeof validator._validate === 'function') {
        errs.push(...validator._validate(val[key], fieldPath));
      }
    }
    return errs;
  }
}

class ArrayType extends BaseType {
  constructor(itemSchema) {
    super();
    this.type = 'array';
    this.itemSchema = itemSchema;
    this._min = null;
    this._max = null;
  }

  min(n) { this._min = n; return this; }
  max(n) { this._max = n; return this; }

  _validate(val, path = '') {
    const errs = [];
    if (val === undefined || val === null) {
      if (!this._optional) errs.push({ path, message: 'Required field is missing' });
      return errs;
    }
    if (!Array.isArray(val)) {
      errs.push({ path, message: `Expected array, got ${typeof val}` });
      return errs;
    }
    if (this._min !== null && val.length < this._min) {
      errs.push({ path, message: `Array must have at least ${this._min} items` });
    }
    if (this._max !== null && val.length > this._max) {
      errs.push({ path, message: `Array must have at most ${this._max} items` });
    }
    if (this.itemSchema) {
      val.forEach((item, idx) => {
        errs.push(...this.itemSchema._validate(item, `${path}[${idx}]`));
      });
    }
    return errs;
  }
}

class EnumType extends BaseType {
  constructor(values = []) {
    super();
    this.type = 'enum';
    this.values = values;
  }

  _validate(val, path = '') {
    const errs = [];
    if (val === undefined || val === null) {
      if (!this._optional) errs.push({ path, message: 'Required field is missing' });
      return errs;
    }
    if (!this.values.includes(val)) {
      errs.push({ path, message: `Value must be one of: ${this.values.join(', ')}` });
    }
    return errs;
  }
}

const v = {
  string: () => new StringType(),
  number: () => new NumberType(),
  boolean: () => new BooleanType(),
  object: (s) => new ObjectType(s),
  array: (s) => new ArrayType(s),
  enum: (vals) => new EnumType(vals),

  validate(schema, data) {
    const errors = schema._validate(data, '');
    if (errors.length > 0) {
      throw new ValidationError(
        `Validation failed: ${errors.map(e => (e.path ? `${e.path}: ` : '') + e.message).join('; ')}`,
        errors
      );
    }
    return data;
  },

  safeParse(schema, data) {
    const errors = schema._validate(data, '');
    if (errors.length > 0) {
      return { success: false, errors };
    }
    return { success: true, data };
  },

  ValidationError
};

module.exports = v;

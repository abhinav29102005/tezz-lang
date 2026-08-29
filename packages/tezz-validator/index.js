module.exports = {
  string: () => ({ type: 'string' }),
  number: () => ({ type: 'number' }),
  boolean: () => ({ type: 'boolean' }),
  object: (schema) => ({ type: 'object', schema }),
  validate(schema, data) {
    if (schema.type === 'string' && typeof data !== 'string') throw new Error('Validation failed: expected string');
    if (schema.type === 'number' && typeof data !== 'number') throw new Error('Validation failed: expected number');
    if (schema.type === 'boolean' && typeof data !== 'boolean') throw new Error('Validation failed: expected boolean');
    if (schema.type === 'object') {
      if (typeof data !== 'object' || data === null) throw new Error('Validation failed: expected object');
      for (const key in schema.schema) {
        this.validate(schema.schema[key], data[key]);
      }
    }
    return data;
  }
};

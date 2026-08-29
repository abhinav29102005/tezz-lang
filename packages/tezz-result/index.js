
class Result {
  constructor(isOk, value, error) {
    this.isOk = isOk;
    this.value = value;
    this.error = error;
  }
  static Ok(val) { return new Result(true, val, null); }
  static Err(err) { return new Result(false, null, err); }
  unwrap() { if (!this.isOk) throw this.error; return this.value; }
}

class Option {
  constructor(isSome, value) {
    this.isSome = isSome;
    this.value = value;
  }
  static Some(val) { return new Option(true, val); }
  static None() { return new Option(false, null); }
  unwrap() { if (!this.isSome) throw new Error("Called unwrap on None"); return this.value; }
}

module.exports = { Result, Option };

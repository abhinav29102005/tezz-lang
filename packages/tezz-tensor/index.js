
class Tensor {
  constructor(shape, data) {
    this.shape = shape;
    this.data = data || new Float64Array(shape.reduce((a, b) => a * b, 1));
  }
  
  static zeros(shape) {
    return new Tensor(shape);
  }
  
  static fromArray(arr) {
    const data = new Float64Array(arr);
    return new Tensor([arr.length], data);
  }
  
  add(other) {
    const out = new Tensor(this.shape);
    for (let i = 0; i < this.data.length; i++) {
      out.data[i] = this.data[i] + other.data[i];
    }
    return out;
  }
}


module.exports = { Tensor, createTensor: (d, s) => new Tensor(d, s) };

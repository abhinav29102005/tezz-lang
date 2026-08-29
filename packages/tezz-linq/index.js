
class Enumerable {
  constructor(arr) {
    this.arr = arr;
  }
  
  Where(predicate) {
    return new Enumerable(this.arr.filter(predicate));
  }
  
  Select(selector) {
    return new Enumerable(this.arr.map(selector));
  }
  
  OrderBy(selector) {
    return new Enumerable([...this.arr].sort((a, b) => selector(a) > selector(b) ? 1 : -1));
  }
  
  First() {
    return this.arr[0];
  }
  
  ToList() {
    return this.arr;
  }
}

function From(arr) {
  return new Enumerable(arr);
}

module.exports = { From };

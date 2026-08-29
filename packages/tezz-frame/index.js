
class DataFrame {
  constructor(data) {
    // data is array of objects
    this.data = data;
    this.columns = data.length > 0 ? Object.keys(data[0]) : [];
  }
  
  filter(predicate) {
    return new DataFrame(this.data.filter(predicate));
  }
  
  select(cols) {
    return new DataFrame(this.data.map(row => {
      let obj = {};
      cols.forEach(c => obj[c] = row[c]);
      return obj;
    }));
  }
  
  head(n = 5) {
    return new DataFrame(this.data.slice(0, n));
  }
}


module.exports = { DataFrame, createDataFrame: (d) => new DataFrame(d) };

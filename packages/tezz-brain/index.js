
class SimpleLinearRegression {
  constructor() {
    this.m = 0;
    this.b = 0;
  }
  
  fit(X, y) {
    const n = X.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += X[i];
      sumY += y[i];
      sumXY += X[i] * y[i];
      sumXX += X[i] * X[i];
    }
    this.m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    this.b = (sumY - this.m * sumX) / n;
  }
  
  predict(X) {
    return X.map(x => this.m * x + this.b);
  }
}


module.exports = { SimpleLinearRegression, createSimpleLinearRegression: () => new SimpleLinearRegression() };

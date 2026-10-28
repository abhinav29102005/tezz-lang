// Tezz Language — DataFrames (tezz-frame)
// High-performance tabular data manipulation for Tezz

class DataFrame {
  constructor(data = []) {
    this.data = Array.isArray(data) ? data : [];
    this.columns = this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }

  // Row count
  get length() {
    return this.data.length;
  }

  count() {
    return this.data.length;
  }

  // Row filtering
  filter(predicate) {
    return new DataFrame(this.data.filter(predicate));
  }

  // Column selection
  select(cols) {
    const colList = Array.isArray(cols) ? cols : [cols];
    return new DataFrame(this.data.map(row => {
      const obj = {};
      for (const c of colList) {
        if (c in row) obj[c] = row[c];
      }
      return obj;
    }));
  }

  // Drop columns
  drop(cols) {
    const colSet = new Set(Array.isArray(cols) ? cols : [cols]);
    return new DataFrame(this.data.map(row => {
      const obj = {};
      for (const k of Object.keys(row)) {
        if (!colSet.has(k)) obj[k] = row[k];
      }
      return obj;
    }));
  }

  // Add / compute new columns
  mutate(fnOrNewCols) {
    if (typeof fnOrNewCols === 'function') {
      return new DataFrame(this.data.map(row => ({ ...row, ...fnOrNewCols(row) })));
    }
    return new DataFrame(this.data.map(row => ({ ...row, ...fnOrNewCols })));
  }

  // Sort rows
  sort(col, ascending = true) {
    const sorted = [...this.data].sort((a, b) => {
      const valA = a[col];
      const valB = b[col];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    return new DataFrame(sorted);
  }

  // Head and Tail
  head(n = 5) {
    return new DataFrame(this.data.slice(0, n));
  }

  tail(n = 5) {
    return new DataFrame(this.data.slice(Math.max(0, this.data.length - n)));
  }

  // Numerical statistics on a column
  sum(col) {
    return this.data.reduce((acc, row) => acc + (Number(row[col]) || 0), 0);
  }

  mean(col) {
    if (this.data.length === 0) return 0;
    return this.sum(col) / this.data.length;
  }

  min(col) {
    if (this.data.length === 0) return null;
    return this.data.reduce((min, row) => row[col] < min ? row[col] : min, this.data[0][col]);
  }

  max(col) {
    if (this.data.length === 0) return null;
    return this.data.reduce((max, row) => row[col] > max ? row[col] : max, this.data[0][col]);
  }

  std(col) {
    if (this.data.length <= 1) return 0;
    const avg = this.mean(col);
    const variance = this.data.reduce((acc, row) => {
      const diff = (Number(row[col]) || 0) - avg;
      return acc + diff * diff;
    }, 0) / (this.data.length - 1);
    return Math.sqrt(variance);
  }

  describe() {
    const stats = {};
    for (const col of this.columns) {
      const isNum = this.data.some(row => typeof row[col] === 'number');
      if (isNum) {
        stats[col] = {
          count: this.data.length,
          mean: Number(this.mean(col).toFixed(4)),
          std: Number(this.std(col).toFixed(4)),
          min: this.min(col),
          max: this.max(col)
        };
      }
    }
    return stats;
  }

  // GroupBy operations
  groupBy(keys) {
    const keyList = Array.isArray(keys) ? keys : [keys];
    const groups = new Map();

    for (const row of this.data) {
      const groupKey = keyList.map(k => String(row[k])).join(':::');
      if (!groups.has(groupKey)) {
        groups.set(groupKey, { groupProps: Object.fromEntries(keyList.map(k => [k, row[k]])), rows: [] });
      }
      groups.get(groupKey).rows.push(row);
    }

    return new GroupedDataFrame(groups);
  }

  // Relational Joins
  join(other, on, how = 'inner') {
    const otherData = other instanceof DataFrame ? other.data : other;
    const key = on;
    const result = [];

    const rightMap = new Map();
    for (const r of otherData) {
      const k = r[key];
      if (!rightMap.has(k)) rightMap.set(k, []);
      rightMap.get(k).push(r);
    }

    const matchedRightKeys = new Set();

    for (const leftRow of this.data) {
      const k = leftRow[key];
      const matches = rightMap.get(k);

      if (matches && matches.length > 0) {
        matchedRightKeys.add(k);
        for (const rightRow of matches) {
          result.push({ ...rightRow, ...leftRow });
        }
      } else if (how === 'left' || how === 'outer') {
        result.push({ ...leftRow });
      }
    }

    if (how === 'right' || how === 'outer') {
      for (const [k, matches] of rightMap.entries()) {
        if (!matchedRightKeys.has(k)) {
          for (const rightRow of matches) {
            result.push({ ...rightRow });
          }
        }
      }
    }

    return new DataFrame(result);
  }

  // I/O: CSV & JSON
  static fromJSON(jsonStrOrObj) {
    const parsed = typeof jsonStrOrObj === 'string' ? JSON.parse(jsonStrOrObj) : jsonStrOrObj;
    return new DataFrame(parsed);
  }

  toJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  static fromCSV(csvString, delimiter = ',') {
    const lines = csvString.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length === 0) return new DataFrame([]);
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => {
        const val = parts[idx];
        const num = Number(val);
        obj[h] = !isNaN(num) && val !== '' ? num : val;
      });
      rows.push(obj);
    }
    return new DataFrame(rows);
  }

  toCSV(delimiter = ',') {
    if (this.data.length === 0) return '';
    const headers = this.columns;
    const lines = [headers.join(delimiter)];
    for (const row of this.data) {
      lines.push(headers.map(h => {
        const val = row[h] !== undefined ? String(row[h]) : '';
        return val.includes(delimiter) || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(delimiter));
    }
    return lines.join('\n');
  }
}

class GroupedDataFrame {
  constructor(groupsMap) {
    this.groups = groupsMap;
  }

  agg(aggregations) {
    const result = [];
    for (const { groupProps, rows } of this.groups.values()) {
      const summary = { ...groupProps };
      for (const [col, op] of Object.entries(aggregations)) {
        const subDf = new DataFrame(rows);
        const operations = Array.isArray(op) ? op : [op];
        for (const o of operations) {
          const colName = operations.length > 1 ? `${col}_${o}` : col;
          if (typeof subDf[o] === 'function') {
            summary[colName] = subDf[o](col);
          } else if (o === 'count') {
            summary[colName] = subDf.count();
          }
        }
      }
      result.push(summary);
    }
    return new DataFrame(result);
  }
}

module.exports = {
  DataFrame,
  createDataFrame: (d) => new DataFrame(d),
  readJSON: (data) => DataFrame.fromJSON(data),
  readCSV: (csv, sep) => DataFrame.fromCSV(csv, sep)
};

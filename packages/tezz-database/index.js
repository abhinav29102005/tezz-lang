class TezzDatabase {
  constructor(config) {
    this.url = config.url;
    this.token = config.token;
  }

  async execute(sql, args = []) {
    const payload = {
      requests: [
        {
          type: "execute",
          stmt: {
            sql,
            args: args.map(arg => ({ type: typeof arg === 'number' ? 'integer' : 'text', value: arg }))
          }
        }
      ]
    };

    const res = await fetch(`${this.url}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Database error: ${await res.text()}`);
    }

    const data = await res.json();
    const result = data.results[0];
    
    if (result.type === 'error') {
      throw new Error(result.error.message);
    }
    
    return {
      ok: true,
      rows: result.response.result.rows,
      cols: result.response.result.cols,
      affected: result.response.result.affected_row_count
    };
  }
}

export default function createClient(config) {
  return new TezzDatabase(config);
}

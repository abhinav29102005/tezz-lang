module.exports = {
  generate(routes, title="Tezz API", version="1.0.0") {
    const doc = { openapi: '3.0.0', info: { title, version }, paths: {} };
    for (const r of routes) {
      if (!doc.paths[r.path]) doc.paths[r.path] = {};
      doc.paths[r.path][r.method.toLowerCase()] = {
        responses: { '200': { description: 'Success' } }
      };
    }
    return doc;
  }
};

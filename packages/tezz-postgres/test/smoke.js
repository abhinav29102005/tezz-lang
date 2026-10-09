// Smoke test for tezz-postgres
const assert = require('assert');
const createClient = require('../index.js');

async function runTests() {
  console.log('Running tezz-postgres smoke tests...\n');

  // 1. Export verification
  console.log('Test 1: Exports structure');
  assert.strictEqual(typeof createClient, 'function', 'createClient should be a function');
  assert.strictEqual(createClient.default, createClient, 'default export should equal createClient');
  assert.strictEqual(createClient.createClient, createClient, 'named export createClient should exist');
  assert.strictEqual(typeof createClient.getPool, 'function', 'getPool helper should exist');
  assert.strictEqual(typeof createClient.closeAllPools, 'function', 'closeAllPools helper should exist');
  console.log('✓ Exports verified\n');

  // 2. Singleton Pool Caching Verification
  // In C++/Java: verifying that the connection pool factory returns the same pool instance
  console.log('Test 2: Singleton pool caching for identical connection strings');
  const connStrA = 'postgres://user:pw@localhost:5432/testdb';
  const client1 = createClient({ url: connStrA });
  const client2 = createClient({ url: connStrA });

  assert.strictEqual(client1.pool, client2.pool, 'Multiple createClient calls with same URL must share the exact same Pool instance');
  assert.strictEqual(client1.raw, client1.pool, 'db.raw should expose underlying pg.Pool');
  console.log('✓ Pool singleton verified (prevents connection leaks in HTTP route handlers)\n');

  // 3. Different connection strings get different pools
  console.log('Test 3: Different connection strings use separate pools');
  const connStrB = 'postgres://user:pw@localhost:5432/otherdb';
  const client3 = createClient({ url: connStrB });
  assert.notStrictEqual(client1.pool, client3.pool, 'Different URLs must use different pools');
  console.log('✓ Distinct pools created for distinct databases\n');

  // 4. API Shape and Query Mocking
  console.log('Test 4: API shape (.query and .execute compatibility)');
  let queriedSql = null;
  let queriedArgs = null;
  
  // Intercept pool.query to verify mapping
  const dummyClient = createClient({ url: 'postgres://dummy:dummy@localhost:5432/dummy' });
  dummyClient.pool.query = async (sql, args) => {
    queriedSql = sql;
    queriedArgs = args;
    return {
      rows: [{ id: 1, name: 'Alice' }],
      fields: [{ name: 'id' }, { name: 'name' }],
      rowCount: 1
    };
  };

  const res1 = await dummyClient.query('SELECT * FROM users WHERE id = $1', [1]);
  assert.strictEqual(res1.ok, true);
  assert.strictEqual(res1.rows.length, 1);
  assert.strictEqual(res1.rows[0].name, 'Alice');
  assert.deepStrictEqual(res1.cols, ['id', 'name']);
  assert.strictEqual(res1.affected, 1);
  assert.strictEqual(queriedSql, 'SELECT * FROM users WHERE id = $1');
  assert.deepStrictEqual(queriedArgs, [1]);

  // .execute() alias (tezz-database compatibility)
  const res2 = await dummyClient.execute('SELECT * FROM users WHERE id = $1', [2]);
  assert.strictEqual(res2.ok, true);
  assert.deepStrictEqual(queriedArgs, [2]);
  console.log('✓ .query() and .execute() return standard { ok, rows, cols, affected } format\n');

  // 5. Error handling
  console.log('Test 5: Error handling produces catchable rejection');
  dummyClient.pool.query = async () => {
    throw new Error('relation "unknown_table" does not exist');
  };

  try {
    await dummyClient.query('SELECT * FROM unknown_table');
    assert.fail('Should have thrown');
  } catch (err) {
    assert.strictEqual(err.message, 'relation "unknown_table" does not exist');
  }
  console.log('✓ Query errors reject cleanly without crashing process\n');

  // 6. Cleanup
  console.log('Test 6: Pool cleanup');
  await createClient.closeAllPools();
  console.log('✓ closeAllPools() completed cleanly\n');

  // 7. Live Postgres check (if available in environment)
  const liveUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (liveUrl) {
    console.log('Test 7: Live connection test against', liveUrl);
    const liveClient = createClient({ url: liveUrl });
    const liveRes = await liveClient.query('SELECT 1 as num');
    assert.strictEqual(liveRes.rows[0].num, 1);
    console.log('✓ Live database query succeeded');
    await liveClient.close();
  } else {
    console.log('Test 7: (Skipped live connection — set DATABASE_URL or POSTGRES_URL to run against a real server)');
  }

  console.log('\nAll tezz-postgres smoke tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Smoke tests failed:', err);
  process.exit(1);
});

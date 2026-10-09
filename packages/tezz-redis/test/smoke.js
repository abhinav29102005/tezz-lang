// Smoke test for tezz-redis
const assert = require('assert');
const createClient = require('../index.js');

async function runTests() {
  console.log('Running tezz-redis smoke tests...\n');

  // 1. Export verification
  console.log('Test 1: Exports structure');
  assert.strictEqual(typeof createClient, 'function', 'createClient should be a function');
  assert.strictEqual(createClient.default, createClient, 'default export should equal createClient');
  assert.strictEqual(createClient.createClient, createClient, 'named export createClient should exist');
  assert.strictEqual(typeof createClient.getClient, 'function', 'getClient helper should exist');
  assert.strictEqual(typeof createClient.closeAllClients, 'function', 'closeAllClients helper should exist');
  console.log('✓ Exports verified\n');

  // 2. Singleton connection caching
  console.log('Test 2: Singleton client caching for identical connection strings');
  const urlA = 'redis://localhost:6379/0';
  const client1 = createClient({ url: urlA });
  const client2 = createClient({ url: urlA });

  assert.strictEqual(client1.client, client2.client, 'Repeated createClient calls with same URL must share the same ioredis instance');
  assert.strictEqual(client1.raw, client1.client, 'db.raw should expose underlying client');
  console.log('✓ Singleton caching verified (prevents TCP socket leaks in HTTP route handlers)\n');

  // 3. Distinct URLs use separate connections
  console.log('Test 3: Different connection strings use separate clients');
  const urlB = 'redis://localhost:6379/1';
  const client3 = createClient({ url: urlB });
  assert.notStrictEqual(client1.client, client3.client, 'Different URLs must use different clients');
  console.log('✓ Distinct clients created for distinct databases\n');

  // 4. API shape and command mocking
  console.log('Test 4: Command operations and JSON serialization');
  const dummy = createClient({ url: 'redis://mock:6379' });
  
  let setCalls = [];
  dummy.client.set = async (...args) => {
    setCalls.push(args);
    return 'OK';
  };
  dummy.client.get = async (k) => {
    if (k === 'string_key') return 'hello world';
    if (k === 'json_key') return JSON.stringify({ count: 42 });
    return null;
  };
  dummy.client.exists = async (k) => (k === 'existing_key' ? 1 : 0);
  dummy.client.del = async (...keys) => keys.length;
  dummy.client.expire = async (k, sec) => 1;
  dummy._ensureConnected = async () => {}; // skip real TCP connect for mock test

  // Test set string
  await dummy.set('name', 'Tezz');
  assert.deepStrictEqual(setCalls[0], ['name', 'Tezz']);

  // Test set object auto-serialization
  await dummy.set('user', { id: 1, name: 'Alice' });
  assert.deepStrictEqual(setCalls[1], ['user', JSON.stringify({ id: 1, name: 'Alice' })]);

  // Test set with TTL
  await dummy.set('session', 'xyz', 60);
  assert.deepStrictEqual(setCalls[2], ['session', 'xyz', 'EX', 60]);

  // Test get
  const strVal = await dummy.get('string_key');
  assert.strictEqual(strVal, 'hello world');

  // Test jsonGet
  const jsonVal = await dummy.jsonGet('json_key');
  assert.deepStrictEqual(jsonVal, { count: 42 });

  // Test exists
  const exists1 = await dummy.exists('existing_key');
  const exists2 = await dummy.exists('missing_key');
  assert.strictEqual(exists1, true);
  assert.strictEqual(exists2, false);

  // Test del
  const deletedCount = await dummy.del('key1', 'key2');
  assert.strictEqual(deletedCount, 2);

  // Test expire
  const expireOk = await dummy.expire('key1', 300);
  assert.strictEqual(expireOk, 1);

  console.log('✓ Commands, JSON serialization, and options mapped correctly\n');

  // 5. Error handling on unreachable connection
  console.log('Test 5: Error handling produces catchable rejection');
  const badClient = createClient({ host: '127.0.0.1', port: 19999, connectTimeout: 300 });
  try {
    await badClient.get('any');
    assert.fail('Should have failed to connect to port 19999');
  } catch (err) {
    assert(err instanceof Error, 'Connection failure must reject with Error');
    console.log('✓ Connection failure rejected cleanly with message:', err.message);
  }

  // 6. Cleanup
  console.log('\nTest 6: Client cleanup');
  await createClient.closeAllClients();
  console.log('✓ closeAllClients() closed all connections\n');

  // 7. Live Redis test (if available in environment)
  const liveUrl = process.env.REDIS_URL;
  if (liveUrl) {
    console.log('Test 7: Live connection test against', liveUrl);
    const live = createClient({ url: liveUrl });
    await live.set('tezz_test_key', 'live_value', 10);
    const liveVal = await live.get('tezz_test_key');
    assert.strictEqual(liveVal, 'live_value');
    console.log('✓ Live Redis query succeeded');
    await live.close();
  } else {
    console.log('Test 7: (Skipped live connection — set REDIS_URL to run against a real server)');
  }

  console.log('\nAll tezz-redis smoke tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Smoke tests failed:', err);
  process.exit(1);
});

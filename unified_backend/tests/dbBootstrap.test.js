const assert = require('assert');
const { initializeDatabase } = require('../src/config/dbBootstrap');
const { query } = require('../src/config/db');

(async () => {
  const result = await initializeDatabase();
  assert.strictEqual(result.ready, true, 'database bootstrap should report ready');

  const userResult = await query(
    'SELECT username, status FROM users WHERE username = $1',
    ['admin'],
  );

  assert.ok(userResult.rows.length > 0, 'default admin user should exist after bootstrap');
  console.log('db bootstrap test passed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

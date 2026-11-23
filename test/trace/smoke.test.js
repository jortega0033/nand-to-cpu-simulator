import test from 'node:test';
import assert from 'node:assert/strict';

test('src/trace imports', async () => {
  const mod = await import('../../src/trace/index.js');
  assert.equal(typeof mod, 'object');
});

import test from 'node:test';
import assert from 'node:assert/strict';

test('src/circuit imports', async () => {
  const mod = await import('../../src/circuit/index.js');
  assert.equal(typeof mod, 'object');
});

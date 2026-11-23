import test from 'node:test';
import assert from 'node:assert/strict';

test('src/gate imports', async () => {
  const mod = await import('../../src/gate/index.js');
  assert.equal(typeof mod, 'object');
});

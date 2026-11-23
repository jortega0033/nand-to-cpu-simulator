import test from 'node:test';
import assert from 'node:assert/strict';

test('src/reference imports', async () => {
  const mod = await import('../../src/reference/index.js');
  assert.equal(typeof mod, 'object');
});

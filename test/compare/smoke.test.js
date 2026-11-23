import test from 'node:test';
import assert from 'node:assert/strict';

test('src/compare imports', async () => {
  const mod = await import('../../src/compare/index.js');
  assert.equal(typeof mod, 'object');
});

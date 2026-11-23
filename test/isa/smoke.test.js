import test from 'node:test';
import assert from 'node:assert/strict';

test('src/isa imports', async () => {
  const mod = await import('../../src/isa/index.js');
  assert.equal(typeof mod, 'object');
});

import test from 'node:test';
import assert from 'node:assert/strict';

test('src/asm imports', async () => {
  const mod = await import('../../src/asm/index.js');
  assert.equal(typeof mod, 'object');
});

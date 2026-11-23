import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const entry = fileURLToPath(new URL('../../src/asm/cli.js', import.meta.url));
const run = (...args) => spawnSync(process.execPath, [entry, ...args], { encoding: 'utf8' });

test('src/asm/cli.js --help prints usage and exits 0', () => {
  const r = run('--help');
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Usage:/);
});

test('src/asm/cli.js --version prints the package version', () => {
  const r = run('--version');
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^\d+\.\d+\.\d+/);
});

test('src/asm/cli.js is not implemented yet and says so', () => {
  const r = run();
  assert.equal(r.status, 2);
  assert.match(r.stderr, /not implemented yet: see #26/);
});

// Loopback-only static server for the browser lab (standard library only).
// Scaffold only: --help and --version work; the real behaviour arrives with #11.
import { readFileSync } from 'node:fs';

const USAGE = 'Usage: node src/server/main.js [--port <n>]  (loopback static server, binds 127.0.0.1)';
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
} else if (args.includes('--version')) {
  const url = new URL('../../package.json', import.meta.url);
  console.log(JSON.parse(readFileSync(url, 'utf8')).version);
} else {
  console.error('not implemented yet: see #11');
  process.exitCode = 2;
}

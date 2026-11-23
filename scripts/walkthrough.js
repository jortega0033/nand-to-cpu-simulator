// Offline walkthrough script.
// Scaffold only: --help and --version work; the real behaviour arrives with #34.
import { readFileSync } from 'node:fs';

const USAGE = 'Usage: node scripts/walkthrough.js  (offline walkthrough of the display program)';
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
} else if (args.includes('--version')) {
  const url = new URL('../package.json', import.meta.url);
  console.log(JSON.parse(readFileSync(url, 'utf8')).version);
} else {
  console.error('not implemented yet: see #34');
  process.exitCode = 2;
}

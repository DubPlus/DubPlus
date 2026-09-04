import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = path.resolve(__dirname, '..');

export function getTimestampFromFile() {
  const filePath = path.join(__root, 'dubplus.js');
  const code = fs.readFileSync(filePath, 'utf-8');
  // this will only work when dubplus.js was built off the master branch because
  // it won't include the branch name.
  const re = new RegExp(
    '\\$\\{CDN_ROOT\\}/\\$\\{["\']DubPlus@?[a-zA-Z0-9-]*["\']\\}\\$\\{cssFile\\}\\?\\$\\{["\']([0-9]+)["\']\\}',
  );
  const match = code.match(re);
  if (match) {
    const timestamp = match[1];
    return timestamp;
  } else {
    throw new Error('No timestamp found in dubplus.js');
  }
}

export function getTimestamp() {
  try {
    // test if we are in a git repo
    execSync(`test -d "${__root}/.git"`);
    // if we are in a git repo, that means we're building for a new release
    // and we need to inject a new timestamp into the dubplus.js file
    return Date.now().toString();
  } catch {
    // we are not in a git repo, get the timestamp from the dubplus.json file.
    return getTimestampFromFile();
  }
}

import { execSync } from 'node:child_process';
import path from 'node:path';
import { getCurrentBranch } from './git-branch';

/**
 * This script handles signing the Firefox add-on which submits it to the Mozilla Add-ons site.
 *
 * Documentation for "web-ext sign" command
 * https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign
 *
 * 1. You must run this from the root of the repo
 * 2. You must have a .env file in the root of the repo with WEB_EXT_API_KEY and WEB_EXT_API_SECRET
 * 3. Run this following npm script: `npm run addon-submit`
 */

if (!process.env.WEB_EXT_API_KEY || !process.env.WEB_EXT_API_SECRET) {
  console.error(
    'Missing required environment variables: WEB_EXT_API_KEY, WEB_EXT_API_SECRET',
  );
  process.exit(1);
}

const branchName = getCurrentBranch();
if (!branchName || (branchName !== 'master' && branchName !== 'main')) {
  console.error(
    `Refusing to sign and submit add-on from branch: ${branchName}. Must be from main or master branch.`,
  );
  process.exit(1);
}

function runWebExtSign() {
  const dirname = new URL('.', import.meta.url).pathname;
  const sourceZipPath = path.join(dirname, '../dist/dubplus-source.zip');
  const extensionDir = path.join(dirname, '../extension');

  const args = [
    '--verbose',
    '--channel',
    'listed',
    '--source-dir', // The directory of the extension's source code
    extensionDir,
    '--upload-source-code', // The path to an archive file containing human-readable source code for this submission.
    sourceZipPath,
  ];
  const command = `web-ext sign ${args.join(' ')}`;
  execSync(command, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

runWebExtSign();

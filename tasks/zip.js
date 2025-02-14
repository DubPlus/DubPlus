import { execSync } from 'node:child_process';

/**
 * @description Zips the extension files into a zip file
 */
export function zipExetension() {
  const options = {
    cwd: process.cwd(),
    stdio: 'inherit',
  };
  const excludes = [
    '*.DS_Store',
    '*.git*',
    'node_modules/*',
    '.vscode/*',
    '.env*',
    '.env.*',
    'test-results/*',
    'playwright-report/*',
    '*.zip',
  ].join(' -x ');
  execSync(`zip -vr -FS DubPlus-Extension ./* -x ${excludes}`, options);
}

if (require.main === module) {
  zipExetension();
}

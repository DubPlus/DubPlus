import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pathToThisFile = resolve(fileURLToPath(import.meta.url));
const pathPassedToNode = resolve(process.argv[1]);
const isThisFileBeingRunViaCLI = pathToThisFile.includes(pathPassedToNode);

export function zipExetension() {
  const options = {
    cwd: process.cwd(),
    stdio: 'inherit',
  };
  const excludes = [
    '"*.DS_Store"',
    '"*.git*"',
    '"*node_modules*"',
    '"*.vscode*"',
    '".env*"',
    '"*.zip"',
    '".husky/_/*"',
  ].join(' -x ');
  execSync(`zip -vrX DubPlus-Extension . -x ${excludes}`, options);
}

if (isThisFileBeingRunViaCLI) {
  zipExetension();
}

/*
-v verbose
-r recursive
-S include hidden files and folders. For us that means all of the dot files
-X exclude extra file attributes
*/

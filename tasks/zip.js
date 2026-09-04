import { execSync } from 'node:child_process';
import fs from 'node:fs';

// this is a list of files and directories to include in the zip
const include_list = [
  '.prettierrc',
  'extension/',
  'src/',
  'images/',
  'package-lock.json',
  'svelte.config.js',
  '.nvmrc',
  'CHANGELOG.md',
  'jsconfig.json',
  'package.json',
  'tasks/',
  '.editorconfig',
  '.prettierignore',
  'eslint.config.js',
  'LICENSE',
  'README.md',
  'vite.config.js',
];

// Platform-specific files and folders to exclude
const exclude_patterns = [
  '.DS_Store',
  '*/.DS_Store',
  'Thumbs.db',
  '*/Thumbs.db',
];

function createZip() {
  try {
    const zipFileName = `dist/dubplus-source.zip`;

    console.log('Creating zip file:', zipFileName);

    // Build the zip command with included files and exclusions
    const includeArgs = include_list.join(' ');
    const excludeArgs = exclude_patterns
      .map((pattern) => `-x "${pattern}"`)
      .join(' ');

    const zipCommand = `zip -r "${zipFileName}" ${includeArgs} ${excludeArgs}`;

    console.log('Running command:', zipCommand);

    // Execute the zip command
    execSync(zipCommand, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log(`✅ Successfully created ${zipFileName}`);

    // Show file size
    const stats = fs.statSync(zipFileName);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📦 File size: ${fileSizeInMB} MB`);
  } catch (error) {
    console.error('❌ Error creating zip file:', error.message);
    process.exit(1);
  }
}

createZip();

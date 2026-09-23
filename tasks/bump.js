/**
 * Version bumper. Run with `npm run bump` (prompts for the bump type) or
 * `npm run bump patch|minor|major` to skip the prompt.
 *
 * Updates the version in package.json + extension/manifest.json and adds a
 * placeholder CHANGELOG entry. Does not touch git.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import pkg from '../package.json' with { type: 'json' };
import manifest from '../extension/manifest.json' with { type: 'json' };

const root = new URL('../', import.meta.url);
const SECTION = { major: 'Breaking', minor: 'New', patch: 'Fixed' };

const targets = [
  { file: 'package.json', version: pkg.version },
  { file: 'extension/manifest.json', version: manifest.version },
];

function bump(version, type) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Can't bump "${version}", expected a x.y.z version`);
  }
  const index = { major: 0, minor: 1, patch: 2 }[type];
  parts[index]++;
  parts.fill(0, index + 1);
  return parts.join('.');
}

if (pkg.version !== manifest.version) {
  throw new Error(
    `Version mismatch: package.json is ${pkg.version}, extension/manifest.json is ${manifest.version}. Fix that first.`,
  );
}

console.log(`Current version: ${pkg.version}`);

let type = process.argv[2];
if (!type) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  type = (await rl.question('Bump major, minor, or patch? '))
    .trim()
    .toLowerCase();
  rl.close();
}
if (!SECTION[type]) {
  throw new Error(
    `Unknown bump type "${type}", expected major, minor, or patch`,
  );
}

const next = bump(pkg.version, type);

// Swap just the version string instead of re-stringifying: JSON.stringify
for (const { file, version } of targets) {
  const url = new URL(file, root);
  writeFileSync(
    url,
    readFileSync(url, 'utf8').replace(
      `"version": "${version}"`,
      `"version": "${next}"`,
    ),
  );
}

// Insert above the most recent release heading.
const changelog = new URL('CHANGELOG.md', root);
const entry = `## [${next}] - YYYY-MM-DD\n\n### ${SECTION[type]}\n\n- TODO\n\n`;
writeFileSync(
  changelog,
  readFileSync(changelog, 'utf8').replace(/^## \[/m, entry + '## ['),
);

console.log(
  `Bumped to ${next} in ${targets.map((t) => t.file).join(', ')} + CHANGELOG.md`,
);

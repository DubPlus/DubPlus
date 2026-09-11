import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { compareVersions } from './version.js';

/**
 * This script handles signing the Firefox add-on which submits it to the Mozilla Add-ons site.
 *
 * Documentation for "web-ext sign" command
 * https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#web-ext-sign
 *
 * 1. You must run this from the root of the repo
 * 2. You must have WEB_EXT_API_KEY and WEB_EXT_API_SECRET set. Locally that
 *    means a .env file in the root of the repo; in CI they come from the
 *    repository secrets.
 * 3. Run this following npm script: `npm run addon-submit`
 */

if (!process.env.WEB_EXT_API_KEY || !process.env.WEB_EXT_API_SECRET) {
  console.error(
    'Missing required environment variables: WEB_EXT_API_KEY, WEB_EXT_API_SECRET',
  );
  process.exit(1);
}

const dirname = new URL('.', import.meta.url).pathname;
const manifestPath = path.join(dirname, '../extension/manifest.json');

/**
 * @returns {Promise<{version: string, addonId: string}>}
 */
async function readManifest() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const addonId = manifest.browser_specific_settings?.gecko?.id;

  if (!manifest.version) {
    throw new Error(`No "version" found in ${manifestPath}`);
  }
  if (!addonId) {
    throw new Error(
      `No "browser_specific_settings.gecko.id" found in ${manifestPath}`,
    );
  }

  return { version: manifest.version, addonId };
}

/**
 * The version currently listed on addons.mozilla.org. This endpoint is public
 * so it needs no credentials.
 * https://mozilla.github.io/addons-server/topics/api/addons.html#detail
 * @param {string} addonId
 * @returns {Promise<string | undefined>} undefined if the add-on has never
 * been listed (AMO answers 404 for an unknown guid).
 */
async function fetchListedVersion(addonId) {
  const url = `https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(addonId)}/`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(`AMO responded with HTTP ${response.status} for ${url}`);
  }

  const body = await response.json();
  return body?.current_version?.version;
}

/**
 * AMO rejects a version that has already been uploaded, so check it ourselves
 * first and fail with a message that explains why. Unlike the Chrome script
 * this fails closed: if we cannot reach AMO we do not sign.
 * @param {string} newVersion
 * @param {string | undefined} listedVersion
 */
function checkVersion(newVersion, listedVersion) {
  if (!listedVersion) {
    console.log(`🔢 Publishing version ${newVersion} (nothing listed yet).`);
    return;
  }

  const comparison = compareVersions(newVersion, listedVersion);
  if (comparison === null) {
    throw new Error(
      `Could not compare "${newVersion}" with the listed version "${listedVersion}".`,
    );
  }
  if (comparison <= 0) {
    throw new Error(
      `Version ${newVersion} is ${comparison === 0 ? 'the same as' : 'lower than'} the listed version ${listedVersion}.
  Mozilla Add-ons only accepts a version higher than the one already listed.
  Bump "version" in extension/manifest.json and try again.`,
    );
  }

  console.log(
    `🔢 Publishing version ${newVersion} (currently listed: ${listedVersion}).`,
  );
}

function runWebExtSign() {
  const sourceZipPath = path.join(dirname, '../dist/dubplus-source.zip');
  const extensionDir = path.join(dirname, '../extension');

  const args = [
    '--verbose',
    '--approval-timeout 0', // don't wait for approval, submit immediately
    '--channel listed',
    `--source-dir ${extensionDir}`, // The directory of the extension's source code
    `--upload-source-code ${sourceZipPath}`, // The path to an archive file containing human-readable source code for this submission.
  ];
  const command = `web-ext sign ${args.join(' ')}`;
  execSync(command, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

async function main() {
  const { version, addonId } = await readManifest();
  checkVersion(version, await fetchListedVersion(addonId));
  runWebExtSign();
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});

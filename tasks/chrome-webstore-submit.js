#!/usr/bin/env node

/**
 * Chrome Web Store Publishing Script
 *
 * IMPORTANT NOTE:
 * This script has not been tested yet so use with caution.
 *
 * This script automates the process of uploading and publishing an extension
 * to the Chrome Web Store using the Chrome Web Store API.
 *
 * It's based on official documentation:
 * https://developer.chrome.com/docs/webstore/using-api
 *
 * Prerequisites:
 * Follow the steps in the official documentation to get your OAuth2 credentials
 * and also create the extension zip.
 */

import { constants } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef {'ITEM_STATE_UNSPECIFIED' | 'PENDING_REVIEW' | 'STAGED' | 'PUBLISHED' | 'PUBLISHED_TO_TESTERS' | 'REJECTED' | 'CANCELLED'} ItemState https://developer.chrome.com/docs/webstore/api/reference/rest/v2/ItemState
 *
 * @typedef {'UPLOAD_STATE_UNSPECIFIED' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'NOT_FOUND'} UploadState https://developer.chrome.com/docs/webstore/api/reference/rest/v2/UploadState
 *
 * @typedef {object} DistributionChannel https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/fetchStatus#DistributionChannel
 * @property {number} deployPercentage
 * @property {string} crxVersion
 *
 * @typedef {object} ItemRevisionStatus https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/fetchStatus#ItemRevisionStatus
 * @property {ItemState} state
 * @property {DistributionChannel[]} [distributionChannels]
 *
 * @typedef {object} FetchStatusResponse https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/fetchStatus
 * @property {string} itemId
 * @property {string} name
 * @property {string} publicKey
 * @property {ItemRevisionStatus} [publishedItemRevisionStatus] Unset if the item has never been published.
 * @property {ItemRevisionStatus} [submittedItemRevisionStatus]
 * @property {UploadState} [lastAsyncUploadState]
 * @property {boolean} [takenDown]
 * @property {boolean} [warned]
 *
 * @typedef {object} Warning https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/publish#warning
 * @property {string} reason
 * @property {string} description
 *
 * @typedef {object} WarningsInfo https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/publish#WarningsInfo
 * @property {Warning[]} [warnings] List of warning messages, if any.
 *
 * @typedef {object} PublishResponse https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/publish
 * @property {string} name
 * @property {string} itemId
 * @property {ItemState} state
 * @property {WarningsInfo} [warningInfo]
 *
 * @typedef {object} MediaUploadResponse https://developer.chrome.com/docs/webstore/api/reference/rest/v2/media/upload
 * @property {string} name
 * @property {string} itemId
 * @property {string} crxVersion
 * @property {UploadState} uploadState
 */

/**
 * @type {ItemState[]} List of item states considered as bad or undesirable.
 */
const BAD_ITEM_STATES = ['REJECTED', 'CANCELLED', 'ITEM_STATE_UNSPECIFIED'];

/**
 * Human readable explanation for every ItemState, used to report what actually
 * happened instead of a bare enum value.
 * @type {Record<ItemState, string>}
 */
const ITEM_STATE_DESCRIPTIONS = {
  ITEM_STATE_UNSPECIFIED:
    'Unspecified state. The API did not report a usable state.',
  PENDING_REVIEW:
    'Submitted and waiting on Chrome Web Store review. Reviews usually take a few hours but can take several days. You will get an email when it is done.',
  STAGED:
    'Approved but NOT live yet. This revision is staged and has to be published from the developer dashboard (or with a staged rollout deploy).',
  PUBLISHED: 'Live publicly on the Chrome Web Store.',
  PUBLISHED_TO_TESTERS: 'Live for trusted testers only, not for the public.',
  REJECTED:
    'Rejected by review. Check the developer dashboard for the rejection reason before resubmitting.',
  CANCELLED: 'The submission was cancelled.',
};

// How long to wait for an asynchronous (large) package upload to finish.
const POLL_INTERVAL_MS = 5000;
const POLL_MAX_ATTEMPTS = 24; // 24 * 5s = 2 minutes

// Configuration - these should be set via environment variables or config file
const CONFIG = {
  CLIENT_ID: process.env.CHROME_WS_CLIENT_ID,
  CLIENT_SECRET: process.env.CHROME_WS_CLIENT_SECRET,
  REFRESH_TOKEN: process.env.CHROME_WS_REFRESH_TOKEN,
  EXTENSION_ID: process.env.CHROME_WS_EXTENSION_ID,
  PUBLISHER_ID: process.env.CHROME_WS_PUBLISHER_ID,
  ZIP_PATH:
    process.env.ZIP_PATH || join(__dirname, '../dist/dubplus-extension.zip'),
  // The version we expect to be publishing. The Web Store rejects an upload
  // whose manifest version is not higher than the currently published one, so
  // we check that ourselves first to fail with a message that explains why.
  NEW_VERSION: process.env.NEW_EXTENSION_VERSION,
  // The publish call fails on validation warnings by default so nothing gets
  // submitted by surprise. Set CHROME_WS_ALLOW_WARNINGS=true to publish anyway.
  ALLOW_WARNINGS: process.env.CHROME_WS_ALLOW_WARNINGS === 'true',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Parse a Chrome extension version ("1", "1.2", "1.2.3", "1.2.3.4" - each part
 * an integer between 0 and 65535).
 * https://developer.chrome.com/docs/extensions/reference/manifest/version
 * @param {string} version
 * @returns {number[] | null} The version parts, or null if it isn't valid.
 */
function parseVersion(version) {
  if (typeof version !== 'string') return null;
  const parts = version.trim().split('.');
  if (parts.length === 0 || parts.length > 4) return null;
  const numbers = parts.map((part) =>
    /^\d+$/.test(part) ? Number(part) : NaN,
  );
  if (numbers.some((n) => !Number.isInteger(n) || n < 0 || n > 65535)) {
    return null;
  }
  return numbers;
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number | null} 1 if a > b, -1 if a < b, 0 if equal, null if either
 * version could not be parsed.
 */
function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  if (!left || !right) return null;

  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

/**
 * The highest crxVersion across a revision's distribution channels.
 * @param {ItemRevisionStatus} [revisionStatus]
 * @returns {string | undefined}
 */
function getCrxVersion(revisionStatus) {
  const versions = (revisionStatus?.distributionChannels ?? [])
    .map((channel) => channel?.crxVersion)
    .filter((version) => typeof version === 'string' && version.length > 0);

  return versions.sort((a, b) => compareVersions(a, b) ?? 0).at(-1);
}

/**
 * Turn an error response body into something worth reading. Google uses two
 * different error shapes depending on the endpoint:
 *   OAuth2:       { error: "invalid_grant", error_description: "..." }
 *   Google APIs:  { error: { code, message, status, details: [...] } }
 * @param {number} status
 * @param {string} statusText
 * @param {string} rawBody
 * @returns {string}
 */
function describeApiError(status, statusText, rawBody) {
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch {
    const snippet = rawBody?.trim().slice(0, 300);
    return `HTTP ${status}: ${statusText}${snippet ? ` - ${snippet}` : ''}`;
  }

  const parts = [];

  if (typeof data?.error === 'string') {
    // OAuth2 token endpoint
    parts.push(data.error_description || data.error);
    if (data.error_description) parts.push(`(${data.error})`);
  } else if (data?.error?.message) {
    // Standard Google API error
    parts.push(data.error.message);
    if (data.error.status) parts.push(`(${data.error.status})`);
    const details = data.error.details;
    if (Array.isArray(details) && details.length > 0) {
      parts.push(`\n  details: ${JSON.stringify(details)}`);
    }
  }

  const message = parts.join(' ').trim();
  return `HTTP ${status}: ${message || statusText}`;
}

/**
 * Extra guidance for the failures that are easy to hit and hard to diagnose
 * from the raw API message alone.
 * @param {string} message
 * @returns {string} A hint to append, or an empty string.
 */
function getErrorHint(message) {
  if (message.includes('invalid_grant')) {
    return `
  Hint: the refresh token is expired or revoked. If your OAuth consent screen is
  still in "Testing" publishing status, Google expires refresh tokens after 7 days.
  Set the consent screen to "In production" and generate a new refresh token.
  See https://developer.chrome.com/docs/webstore/using-api`;
  }
  if (message.includes('invalid_client')) {
    return `
  Hint: CHROME_WS_CLIENT_ID / CHROME_WS_CLIENT_SECRET do not match an existing
  OAuth client, or the client was deleted.`;
  }
  if (
    message.includes('has not been used in project') ||
    message.includes('SERVICE_DISABLED')
  ) {
    return `
  Hint: enable the "Chrome Web Store API" in the Google Cloud project that owns
  your OAuth client, then wait a minute and retry.`;
  }
  if (message.includes('PERMISSION_DENIED') || message.includes('HTTP 403')) {
    return `
  Hint: the authenticated Google account must be an owner/publisher of
  CHROME_WS_PUBLISHER_ID and have access to CHROME_WS_EXTENSION_ID.`;
  }
  if (message.includes('HTTP 404')) {
    return `
  Hint: check CHROME_WS_PUBLISHER_ID and CHROME_WS_EXTENSION_ID. A 404 here
  usually means the item ID does not exist under that publisher.`;
  }
  return '';
}

function validateConfig() {
  const required = [
    'CLIENT_ID',
    'CLIENT_SECRET',
    'REFRESH_TOKEN',
    'EXTENSION_ID',
    'PUBLISHER_ID',
  ];
  const missing = required.filter((key) => !CONFIG[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required configuration:
${missing.map((key) => `  - ${key}`).join('\n')}

Please set the following environment variables:
  CHROME_WS_CLIENT_ID
  CHROME_WS_CLIENT_SECRET
  CHROME_WS_REFRESH_TOKEN
  CHROME_WS_EXTENSION_ID
  CHROME_WS_PUBLISHER_ID

Optional:
  NEW_EXTENSION_VERSION     the version being published, checked against the store
  ZIP_PATH                  defaults to dist/dubplus-extension.zip
  CHROME_WS_ALLOW_WARNINGS  set to "true" to publish despite validation warnings
`);
    process.exit(1);
  }
}

/**
 * @returns {string} The base resource path shared by every item endpoint.
 */
function itemPath() {
  return `publishers/${CONFIG.PUBLISHER_ID}/items/${CONFIG.EXTENSION_ID}`;
}

async function makeRequest(url, options = {}) {
  const { method = 'GET', headers = {}, body } = options;

  let response;
  try {
    response = await fetch(url, { method, headers, body });
  } catch (error) {
    // undici wraps connection failures in a TypeError whose `cause` holds
    // the real reason (DNS, TLS, ECONNREFUSED...).
    const cause = error.cause?.message ? ` (${error.cause.message})` : '';
    throw new Error(`Network error: ${error.message}${cause}`);
  }

  if (!response.ok) {
    // Read the body exactly once - a Response body can't be re-read.
    let rawBody = '';
    try {
      rawBody = await response.text();
    } catch {
      // Keep the status line as the only detail we have.
    }
    throw new Error(
      describeApiError(response.status, response.statusText, rawBody),
    );
  }

  const rawBody = await response.text();
  if (!rawBody) return {};
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error(
      `Expected JSON from ${url} but got: ${rawBody.trim().slice(0, 300)}`,
    );
  }
}

// Set by getAccessToken() and read by authHeaders() for every request after it.
let accessToken = null;

async function getAccessToken() {
  // curl "https://oauth2.googleapis.com/token"
  // -d "client_secret=$CLIENT_SECRET&grant_type=refresh_token&refresh_token=$REFRESH_TOKEN&client_id=$CLIENT_ID"
  console.log('🔑 Getting access token...');

  const body = new URLSearchParams({
    client_id: CONFIG.CLIENT_ID,
    client_secret: CONFIG.CLIENT_SECRET,
    refresh_token: CONFIG.REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  try {
    const response = await makeRequest('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    /**
     * response will be an object that looks like this:
     * {
     *   "access_token" : "ya29...",
     *   "expires_in" : 3600,
     *   "refresh_token" : "1/rwn...",
     *   "scope": "https://www.googleapis.com/auth/chromewebstore",
     *   "token_type" : "Bearer",
     * }
     */
    if (!response.access_token) {
      throw new Error(
        'the token response did not contain an access_token. Response was: ' +
          JSON.stringify(response),
      );
    }

    accessToken = response.access_token;
    console.log('✅ Access token obtained');
    return accessToken;
  } catch (error) {
    throw new Error(`Failed to get access token: ${error.message}`);
  }
}

/**
 * @returns {Record<string, string>}
 */
function authHeaders() {
  return { Authorization: `Bearer ${accessToken}` };
}

/**
 * https://developer.chrome.com/docs/webstore/api/reference/rest/v2/media/upload
 * Media Upload, not metadata
 * @returns {Promise<MediaUploadResponse>} The upload response, including the
 * upload state and the crxVersion read from the uploaded manifest.
 * @throws {Error} If the upload fails.
 */
async function uploadExtension() {
  // curl
  // -H "Authorization: Bearer $TOKEN"
  // -X POST
  // -T $FILE_NAME
  // -v https://chromewebstore.googleapis.com/upload/v2/publishers/PUBLISHER_ID/items/EXTENSION_ID:upload
  console.log('📦 Uploading extension package...');

  const url = `https://chromewebstore.googleapis.com/upload/v2/${itemPath()}:upload`;

  try {
    const zipData = await readFile(CONFIG.ZIP_PATH);

    /**
     * @type {MediaUploadResponse}
     */
    const response = await makeRequest(url, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/zip',
      },
      body: zipData,
    });

    return response;
  } catch (error) {
    throw new Error(`Failed to upload extension: ${error.message}`);
  }
}

/**
 * https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/publish
 * @returns {Promise<PublishResponse>} The response from the publish API.
 * @throws {Error} If the publish request fails.
 */
async function publishExtension() {
  // curl -H "Authorization: Bearer $TOKEN"
  // -X POST
  // -v https://chromewebstore.googleapis.com/v2/publishers/PUBLISHER_ID/items/EXTENSION_ID:publish
  console.log('🚀 Publishing extension...');

  const url = `https://chromewebstore.googleapis.com/v2/${itemPath()}:publish`;

  // blockOnWarnings makes the API reject the request when it finds validation
  // warnings, so we don't submit something questionable and only find out
  // after the fact. Opt out with CHROME_WS_ALLOW_WARNINGS=true.
  const requestBody = {
    publishType: 'DEFAULT_PUBLISH',
    blockOnWarnings: !CONFIG.ALLOW_WARNINGS,
  };

  try {
    /**
     * @type {PublishResponse}
     */
    const response = await makeRequest(url, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return response;
  } catch (error) {
    const warningHint = CONFIG.ALLOW_WARNINGS
      ? ''
      : '\n  Hint: this run used blockOnWarnings=true. If the failure above is a validation warning you accept, re-run with CHROME_WS_ALLOW_WARNINGS=true.';
    throw new Error(
      `Failed to publish extension: ${error.message}${warningHint}`,
    );
  }
}

/**
 * Uses the following Google API:
 * https://developer.chrome.com/docs/webstore/api/reference/rest/v2/publishers.items/fetchStatus
 * @param {{quiet?: boolean}} [options] Suppress logging, for polling loops.
 * @returns {Promise<FetchStatusResponse>} The response containing the extension's status.
 * @throws {Error} If the request to fetch extension status fails.
 */
async function getExtensionInfo({ quiet = false } = {}) {
  // curl -H "Authorization: Bearer $TOKEN"
  // -X GET
  // -v https://chromewebstore.googleapis.com/v2/publishers/PUBLISHER_ID/items/EXTENSION_ID:fetchStatus
  if (!quiet) console.log('ℹ️  Getting extension information...');

  const url = `https://chromewebstore.googleapis.com/v2/${itemPath()}:fetchStatus`;

  try {
    /**
     * @type {FetchStatusResponse}
     */
    const response = await makeRequest(url, {
      method: 'GET',
      headers: authHeaders(),
    });

    return response;
  } catch (error) {
    throw new Error(`Failed to fetch extension info: ${error.message}`);
  }
}

/**
 * Inspect the item before touching it, and bail out early on anything that
 * would make the upload pointless or destructive.
 * @param {FetchStatusResponse} info
 */
function reviewCurrentStatus(info) {
  const {
    publishedItemRevisionStatus,
    submittedItemRevisionStatus,
    warned,
    takenDown,
  } = info;

  if (takenDown) {
    throw new Error(
      'Extension has been taken down by the Chrome Web Store. Resolve the takedown in the developer dashboard before publishing.',
    );
  }

  // publishedItemRevisionStatus is unset if the item has never been published.
  const publishedState = publishedItemRevisionStatus?.state;
  if (!publishedState) {
    console.log(
      'ℹ️  Extension has no published revision yet (first submission, or still a draft).',
    );
  } else if (publishedState !== 'PUBLISHED') {
    console.log(
      `⚠️  Currently published revision is in state: ${publishedState} - ${ITEM_STATE_DESCRIPTIONS[publishedState] ?? 'Unknown state.'}`,
    );
  }

  if (warned) {
    console.warn(
      '⚠️  Extension has warnings. Check developer dashboard for more info.',
    );
  }

  if (publishedState && BAD_ITEM_STATES.includes(publishedState)) {
    throw new Error(`Extension is in a bad state: ${publishedState}`);
  }

  // Uploading replaces the current draft, including one that is mid-review.
  const submittedState = submittedItemRevisionStatus?.state;
  if (submittedState === 'PENDING_REVIEW' || submittedState === 'STAGED') {
    console.warn(
      `⚠️  There is already a submitted revision in state ${submittedState} (version ${getCrxVersion(submittedItemRevisionStatus) ?? 'unknown'}). This upload will replace it.`,
    );
  }

  return { publishedVersion: getCrxVersion(publishedItemRevisionStatus) };
}

/**
 * The Web Store rejects a package whose manifest version isn't higher than
 * the published one, with an error that doesn't say so. Catch it locally.
 * https://developer.chrome.com/docs/webstore/using-api
 * @param {string | undefined} publishedVersion
 */
function checkVersion(publishedVersion) {
  if (!CONFIG.NEW_VERSION) {
    console.warn(
      '⚠️  NEW_EXTENSION_VERSION is not set, skipping the version check. The upload will fail if the manifest version was not bumped.',
    );
    return;
  }

  if (!parseVersion(CONFIG.NEW_VERSION)) {
    throw new Error(
      `NEW_EXTENSION_VERSION is not a valid extension version: "${CONFIG.NEW_VERSION}". Expected 1 to 4 dot-separated integers between 0 and 65535, e.g. "5.0.1".`,
    );
  }

  if (!publishedVersion) {
    console.log(
      `🔢 Publishing version ${CONFIG.NEW_VERSION} (nothing published yet).`,
    );
    return;
  }

  const comparison = compareVersions(CONFIG.NEW_VERSION, publishedVersion);
  if (comparison === null) {
    console.warn(
      `⚠️  Could not compare "${CONFIG.NEW_VERSION}" with the published version "${publishedVersion}", skipping the version check.`,
    );
    return;
  }

  if (comparison <= 0) {
    throw new Error(
      `Version ${CONFIG.NEW_VERSION} is ${comparison === 0 ? 'the same as' : 'lower than'} the published version ${publishedVersion}.
  The Chrome Web Store only accepts a package whose manifest version is higher than the published one.
  Bump "version" in extension/manifest.json, rebuild the zip, and try again.`,
    );
  }

  console.log(
    `🔢 Publishing version ${CONFIG.NEW_VERSION} (currently published: ${publishedVersion}).`,
  );
}

/**
 * Wait for an asynchronous package upload to reach a terminal state.
 * @returns {Promise<void>}
 */
async function waitForUpload() {
  console.log('⏳ Extension upload in progress. Polling for status...');

  for (let attempt = 1; attempt <= POLL_MAX_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    const { lastAsyncUploadState } = await getExtensionInfo({ quiet: true });

    if (lastAsyncUploadState === 'SUCCEEDED') {
      return;
    }
    if (lastAsyncUploadState === 'FAILED') {
      throw new Error(
        'The package upload failed while processing. Check the developer dashboard for the rejected package details (a bad manifest or a disallowed permission is the usual cause).',
      );
    }
    if (lastAsyncUploadState === 'NOT_FOUND') {
      throw new Error(
        'The Web Store reports no upload attempt for this item (lastAsyncUploadState: NOT_FOUND).',
      );
    }

    if (attempt % 4 === 0) {
      console.log(
        `   ...still ${lastAsyncUploadState ?? 'unknown'} after ${(attempt * POLL_INTERVAL_MS) / 1000}s`,
      );
    }
  }

  throw new Error(
    `The package upload did not finish within ${(POLL_MAX_ATTEMPTS * POLL_INTERVAL_MS) / 1000}s. It may still complete - re-run fetchStatus or check the developer dashboard before uploading again.`,
  );
}

/**
 * @param {MediaUploadResponse} uploadResponse
 */
async function handleUploadState(uploadResponse) {
  const { uploadState, crxVersion } = uploadResponse;

  if (uploadState === 'SUCCEEDED') {
    console.log('✅ Extension uploaded successfully.');
  } else if (uploadState === 'IN_PROGRESS') {
    await waitForUpload();
    console.log('✅ Extension uploaded successfully.');
  } else if (uploadState === 'FAILED') {
    throw new Error(
      'The Web Store rejected the uploaded package (uploadState: FAILED). Check the developer dashboard for details.',
    );
  } else {
    throw new Error(
      `Unexpected upload state: ${uploadState ?? 'none returned'}. Full response: ${JSON.stringify(uploadResponse)}`,
    );
  }

  if (crxVersion) {
    console.log(
      `📄 Store read version ${crxVersion} from the uploaded manifest.`,
    );
    if (
      CONFIG.NEW_VERSION &&
      compareVersions(crxVersion, CONFIG.NEW_VERSION) !== 0
    ) {
      console.warn(
        `⚠️  The uploaded package is version ${crxVersion} but NEW_EXTENSION_VERSION is ${CONFIG.NEW_VERSION}. The zip is probably stale - rebuild it if that is not what you meant to ship.`,
      );
    }
  }
}

/**
 * @param {ItemState} state
 * @param {string} context
 */
function reportState(state, context) {
  const description = ITEM_STATE_DESCRIPTIONS[state] ?? 'Unrecognized state.';

  if (BAD_ITEM_STATES.includes(state)) {
    throw new Error(`${context}: ${state} - ${description}`);
  }
  if (!state) {
    console.warn(`⚠️  ${context}: the API did not report a state.`);
    return;
  }

  console.log(`📊 ${context}: ${state}\n   ${description}`);
}

async function run() {
  validateConfig();

  try {
    console.log('🚀 Starting Chrome Web Store publication process...\n');

    // Check the zip exists before spending anything on network calls.
    try {
      await access(CONFIG.ZIP_PATH, constants.F_OK);
      console.log(`📦 Using extension package: ${CONFIG.ZIP_PATH}`);
    } catch {
      throw new Error(
        `Extension ZIP file not found: ${CONFIG.ZIP_PATH}\nPlease ensure the extension has been built and packaged first (npm run build).`,
      );
    }

    // Get access token, this will set the access token for subsequent API requests
    await getAccessToken();

    // Get current extension info and decide whether it's safe to continue.
    const info = await getExtensionInfo();
    const { publishedVersion } = reviewCurrentStatus(info);
    checkVersion(publishedVersion);

    // Upload the new package.
    const uploadResponse = await uploadExtension();
    await handleUploadState(uploadResponse);

    // Submit it.
    const { state, warningInfo } = await publishExtension();
    if (warningInfo?.warnings?.length) {
      console.warn('⚠️  Extension published with warnings:');
      for (const warning of warningInfo.warnings) {
        console.warn(`   - ${warning.reason}: ${warning.description}`);
      }
    }
    reportState(state, 'Publish result');

    // Confirm what the store thinks the state is now.
    console.log('\n📊 Final extension status:');
    const postPublishInfo = await getExtensionInfo({ quiet: true });
    const submitted = postPublishInfo.submittedItemRevisionStatus;
    reportState(submitted?.state, 'Submitted revision');
    const submittedVersion = getCrxVersion(submitted);
    if (submittedVersion) {
      console.log(`   version: ${submittedVersion}`);
    }
    console.log(
      `   dashboard: https://chrome.google.com/webstore/devconsole/${CONFIG.PUBLISHER_ID}/${CONFIG.EXTENSION_ID}/edit`,
    );

    console.log('\n🎉 Publication process completed successfully!');
  } catch (error) {
    console.error('\n❌ Publication failed:', error.message);
    const hint = getErrorHint(error.message);
    if (hint) console.error(hint);
    process.exit(1);
  }
}

await run();

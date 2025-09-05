// based on this github action:
// https://github.com/marketplace/actions/jsdelivr-cache-purge
import { getCurrentBranch } from './git-branch.js';

/**
 * jsdelivr purge-cached documentation:
 * https://www.jsdelivr.com/documentation#id-purge-cache
 *
 * This script purges the jsDelivr cache for the current branch files.
 *
 * It is intended to be run as part of a CI/CD pipeline.
 *
 * Usage: node tasks/purge-cache.js
 *
 * The script will attempt to purge each URL up to 2 times if it encounters
 * throttling or errors.
 *
 * Successful purges will log a confirmation message.
 *
 * This script will always exit without error even if the purge fails to avoid
 * failing the CI/CD pipeline.
 *
 * Note: jsDelivr may take some time to fully propagate the purge across their
 * CDN network.
 */

const branchName = getCurrentBranch();

if (!branchName) {
  console.error('❌ Exiting because branch name is missing');
  // exiting without error so that we don't fail CI/CD
  process.exit(0);
}

const input = {
  urls: [
    `https://cdn.jsdelivr.net/gh/DubPlus/DubPlus@${branchName}/dubplus.min.js`,
    `https://cdn.jsdelivr.net/gh/DubPlus/DubPlus@${branchName}/dubplus.js`,
    `https://cdn.jsdelivr.net/gh/DubPlus/DubPlus@${branchName}/dubplus.css`,
  ],
  attempts: 2,
};

console.log(`Purging cache for the following URLs:\n${input.urls.join('\n')}`);

// main action entrypoint
async function run() {
  for (let i = 0; i < input.urls.length; i++) {
    const purgingUrl = input.urls[i].replace(
      '//cdn.jsdelivr.net',
      '//purge.jsdelivr.net',
    );

    for (let attemptNumber = 1; ; attemptNumber++) {
      if (attemptNumber > input.attempts) {
        console.error(`❌ Too many (${attemptNumber - 1}) attempts`);
        process.exit(0);
      }

      const res = await fetch(purgingUrl);

      if (!res.ok) {
        console.log(`❌ Wrong response status code = ${res.status}`);
        continue;
      }

      const body = await res.json();

      if (
        Object.hasOwn(body, 'status') &&
        body.status.toLowerCase() !== 'finished'
      ) {
        console.log(`❌ Wrong status state (${body['status']})`);
        continue;
      }

      if (Object.hasOwn(body, 'paths')) {
        for (const path in body.paths) {
          const pathData = body.paths[path];

          if (
            Object.hasOwn(pathData, 'throttled') &&
            pathData.throttled !== false
          ) {
            console.log(JSON.stringify(pathData, null, 2));

            console.log(
              `❌ Purging request for the file "${path}" was throttled`,
            );
            process.exit(0);
          }
        }
      }

      console.log(`✅ Successfully purged cache for "${input.urls[i]}"`);

      break;
    }
  }
}

run();

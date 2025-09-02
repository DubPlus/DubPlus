// based on this github action:
// https://github.com/marketplace/actions/jsdelivr-cache-purge
import { getCurrentBranch } from './git-branch.js';

/**
 * jsdelivr purge-cached documentation:
 * https://www.jsdelivr.com/documentation#id-purge-cache
 */

function branch() {
  const currentBranch = getCurrentBranch();
  if (currentBranch && currentBranch !== 'master' && currentBranch !== 'main') {
    return `@${currentBranch}`;
  } else {
    return '@latest';
  }
}
const branchName = branch();
const input = {
  urls: [
    `https://cdn.jsdelivr.net/gh/DubPlus/DubPlus${branchName}/dubplus.min.js`,
    `https://cdn.jsdelivr.net/gh/DubPlus/DubPlus${branchName}/dubplus.js`,
    `https://cdn.jsdelivr.net/gh/DubPlus/DubPlus${branchName}/dubplus.css`,
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
        throw new Error(`✖ Too many (${attemptNumber - 1}) attempts`);
      }

      const res = await fetch(purgingUrl);

      if (!res.ok) {
        console.log(`✖ Wrong response status code = ${res.status}`);
        continue;
      }

      const body = await res.json();

      if (
        Object.hasOwn(body, 'status') &&
        body.status.toLowerCase() !== 'finished'
      ) {
        console.log(`✖ Wrong status state (${body['status']})`);
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

            throw new Error(
              `✖ Purging request for the file "${path}" was throttled`,
            );
          }
        }
      }

      console.log(`✔ Successfully purged cache for "${input.urls[i]}"`);

      break;
    }
  }
}

run();

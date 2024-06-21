import { logInfo } from "./logger";

/**
 * Looks for a property to exist in the provided starting scope. Handles
 * nested property lookups.
 *
 * For example:
 * if `dottedString` is `"QueUp.room.chat"` and the `startingScope` is the window
 * object, it would check in the following order:
 * 1. `window.Queup`
 * 2. `window.Queup.room`
 * 3. `window.Queup.room.chat`
 *
 * All have to be defined for it to return true.
 *
 * @param  {string} dottedString  the item you are looking for
 * @param  {object} startingScope where to start looking. default: window
 * @return {boolean} if it is defined or not
 */
function deepCheck(dottedString, startingScope = window) {
  const props = dottedString.split(".");

  let depth = startingScope;
  for (let i = 0; i < props.length; i++) {
    if (typeof depth[props[i]] === "undefined") {
      return false;
    }
    depth = depth[props[i]];
  }
  return true;
}

/**
 *
 * @param {string[]} arr
 * @param {object} startingScope
 * @returns
 */
function arrayDeepCheck(arr, startingScope = window) {
  const scope = startingScope;

  for (let i = 0; i < arr.length; i++) {
    if (!deepCheck(arr[i], scope)) {
      logInfo(arr[i], "is not found yet");
      return false;
    }
  }
  return true;
}

/**
 * Checks for the existence of the provides properties
 * @param {string[]} waitingFor what you are waiting for
 * @param {object} [options] options to pass
 * @param {number} [options.interval] how often to ping
 * @param {number} [options.seconds] how long to keep trying before failing
 * @return {Promise<void>}
 */
export function waitFor(waitingFor, options = {}) {
  const defaults = {
    interval: 500, // every XX ms we check to see if all variables are defined
    seconds: 5, // how many total seconds we wish to continue pinging
  };
  const opts = Object.assign({}, defaults, options);

  return new Promise((resolve, reject) => {
    let tryCount = 0;
    const tryLimit = (opts.seconds * 1000) / opts.interval; // how many intervals

    const check = () => {
      tryCount++;
      if (arrayDeepCheck(waitingFor)) {
        resolve();
      } else if (tryCount < tryLimit) {
        window.setTimeout(check, opts.interval);
      } else {
        reject();
      }
    };

    check();
  });
}

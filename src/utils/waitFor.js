import { logInfo } from './logger';

/**
 * Looks for a property to exist in the provided starting scope. Handles
 * nested property lookups. Similar to lodash `_.get()` but only checks for
 * existence, not the value.
 *
 * For example:
 * if `objectPath` is `"QueUp.room.chat"` and the `startingScope` is the window
 * object, it would check in the following order:
 * 1. `window.Queup`
 * 2. `window.Queup.room`
 * 3. `window.Queup.room.chat`
 *
 * All have to be defined for it to return true.
 *
 * @param  {string} objectPath  the item you are looking for
 * @param  {object} [startingScope=window] where to start looking. default: `window`
 * @return {boolean} if it is defined or not
 */
function deepCheck(objectPath, startingScope = window) {
  const props = objectPath.split('.');

  let depth = startingScope;
  for (let i = 0; i < props.length; i++) {
    if (typeof depth[props[i]] === 'undefined') {
      return false;
    }
    depth = depth[props[i]];
  }
  return true;
}

/**
 * Iterates over an array and checks for the existence of each item in the
 * provided starting scope.
 * @param {string[]} arr
 * @param {object} [startingScope=window] default: `window`
 * @returns
 */
export function arrayDeepCheck(arr, startingScope = window) {
  const scope = startingScope;

  for (let i = 0; i < arr.length; i++) {
    if (!deepCheck(arr[i], scope)) {
      logInfo(arr[i], 'is not found yet');
      return false;
    }
  }
  return true;
}

/**
 * Checks for the existence of the provides properties
 * @param {() => boolean} callback a function that returns true when ready
 * @param {object} [options] options to pass
 * @param {number} [options.interval] how often to ping
 * @param {number} [options.seconds] how long to keep trying before failing, default 10
 * @return {Promise<void>}
 */
export function waitFor(callback, options = {}) {
  const defaults = {
    interval: 500, // every XX ms we check to see if all variables are defined
    seconds: 10,
  };
  const opts = Object.assign({}, defaults, options);

  return new Promise((resolve, reject) => {
    let tryCount = 0;
    const tryLimit = (opts.seconds * 1000) / opts.interval; // how many intervals

    const check = () => {
      tryCount++;
      if (callback()) {
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

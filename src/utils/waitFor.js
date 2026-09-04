/**
 * Checks for the existence of the provides properties
 * @param {() => boolean} callback a function that returns true when ready
 * @param {object} [options] options to pass
 * @param {number} [options.interval] how often to ping
 * @param {number} [options.seconds] how long to keep trying before failing, default 10, null or Infinity for no timeout
 * @return {Promise<void>}
 */
export function waitFor(callback, options = {}) {
  const defaults = {
    interval: 500, // every XX ms we check to see callback returns true
    seconds: 10, // how long to keep trying before failing, Number.POSITIVE_INFINITY for no timeout
  };
  const opts = Object.assign({}, defaults, options);

  return new Promise((resolve, reject) => {
    if (!Number.isFinite(opts.seconds)) {
      // if seconds is infinite, we just keep checking every interval until it returns true
      if (callback()) {
        resolve();
        return;
      }

      const intervalId = window.setInterval(() => {
        if (callback()) {
          window.clearInterval(intervalId);
          resolve();
        }
      }, opts.interval);
      return;
    }

    // if seconds is finite, we check every interval until it returns true or we hit the timeout
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

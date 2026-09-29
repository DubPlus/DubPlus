/**
 * Creates a throttled version of `func` that invokes it at most once every
 * `duration` milliseconds. The first call in a window runs immediately;
 * calls made while waiting are dropped. Useful for rate-limiting handlers
 * that fire rapidly, e.g. `scroll` or `mousemove` events.
 *
 * see this blog post: https://kettanaito.com/blog/debounce-vs-throttle
 *
 * @template {(...args: any[]) => void} F
 * @param {F} func the function to throttle
 * @param {number} duration milliseconds to wait between invocations of `func`
 * @returns {(...args: Parameters<F>) => void} the throttled function
 * @example
 * const onScroll = throttle(() => console.log('scrolled'), 200);
 * window.addEventListener('scroll', onScroll);
 */
export function throttle(func, duration) {
  let shouldWait = false;

  /** @this {ThisParameterType<F>} */
  return function (...args) {
    if (shouldWait) {
      return;
    }

    func.apply(this, args);
    shouldWait = true;

    setTimeout(() => {
      shouldWait = false;
    }, duration);
  };
}

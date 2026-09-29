/**
 * Creates a debounced version of `func` that delays invoking it until `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * called. Useful for rate-limiting handlers that fire rapidly, e.g. `input`
 * or `resize` events.
 *
 * If many calls are made to the debounced function, `func` will only be invoked once,
 * after the last call, and only after `wait` milliseconds have passed since that call.
 *
 * See this blog post: https://kettanaito.com/blog/debounce-vs-throttle
 *
 * @template {(...args: any[]) => void} F
 * @param {F} func the function to debounce
 * @param {number} wait milliseconds to wait after the last call before invoking `func`
 * @returns {(...args: Parameters<F>) => void} the debounced function
 * @example
 * const onResize = debounce(() => console.log('resized'), 200);
 * window.addEventListener('resize', onResize);
 */
export function debounce(func, wait) {
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeout;

  /** @this {ThisParameterType<F>} */
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      func.apply(this, args);
    }, wait);
  };
}

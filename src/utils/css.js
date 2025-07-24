import pkg from '../../package.json';
const CDN_ROOT = '//cdn.jsdelivr.net/gh/DubPlus';

/**
 * @param {string} className
 * @param {string} fileName
 * @returns
 */
const makeLink = function (className, fileName) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.className = className;
  link.href = fileName;
  return link;
};

/**
 * Loads a CSS file into <head>.
 * It concats __GIT_BRANCH__ with the first argument (cssFile)
 * @example:
 * css.load("/options/show_timestamps.css", "show_timestamps_link");
 *
 * @param {string} cssFile    the css file location, should start with a /
 * @param {string} className  class name for element
 * @returns {Promise<void>}
 */
export function link(cssFile, className) {
  return new Promise((resolve, reject) => {
    document.querySelector(`link.${className}`)?.remove();
    const cacheBuster = import.meta.env.DEV ? Date.now() : pkg.version;
    const link = makeLink(
      className,
      // @ts-ignore __GIT_BRANCH__ is replaced by vite
      // eslint-disable-next-line no-undef
      `${CDN_ROOT}/${__GIT_BRANCH__}${cssFile}?${cacheBuster}`,
    );
    link.onload = () => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * @param  {string} cssFile
 * @param  {string} id
 * @return {Promise<void>}
 */
export function style(cssFile, id) {
  document.querySelector(`style#${id}`)?.remove();
  return fetch(cssFile)
    .then((res) => res.text())
    .then((css) => {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
    });
}

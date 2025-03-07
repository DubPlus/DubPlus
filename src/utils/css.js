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
 * It concats __SRC_ROOT__ with the first argument (cssFile)
 * @example:
 * css.load("/options/show_timestamps.css", "show_timestamps_link");
 *
 * @param {string} cssFile    the css file location, should start with a /
 * @param {string} className  class name for element
 * @returns {Promise<void>}
 */
export function loadCSS(cssFile, className) {
  return new Promise((resolve, reject) => {
    document.querySelector(`link.${className}`)?.remove();
    const link = makeLink(
      className,
      // @ts-ignore __SRC_ROOT__ & __TIME_STAMP__ are replaced by vite
      // eslint-disable-next-line no-undef
      `${__SRC_ROOT__}${cssFile}?${__TIME_STAMP__}`,
    );
    link.onload = () => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Loads a css file from a full URL in the <head>.
 * Uses a style element instead of a link element
 * @param  {string} cssFile   the full url location of a CSS file
 * @param  {string} id an id to give to the <style> element
 * @return {Promise<void>}
 */
export function loadExternalCss(cssFile, id) {
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

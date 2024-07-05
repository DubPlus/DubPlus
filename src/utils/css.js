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
    if (document.querySelector(`link.${className}`)) {
      // prevent from adding the same css file twice
      resolve();
      return;
    }
    const link = makeLink(
      className,
      // @ts-ignore __SRC_ROOT__ && __TIME_STAMP__ are replaced by vite
      `${__SRC_ROOT__}${cssFile}?${__TIME_STAMP__}`
    );
    link.onload = (e) => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * Loads a css file from a full URL in the <head>
 * @param  {string} cssFile   the full url location of a CSS file
 * @param  {string} className a class name to give to the <link> element
 * @return {void}
 */
export function loadExternalCss(cssFile, className) {
  if (document.querySelector(`link.${className}`)) {
    // prevent from adding the same css file twice
    return;
  }
  const link = makeLink(className, cssFile);
  document.head.appendChild(link);
}

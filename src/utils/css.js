import { settings } from "../lib/settings.svelte.js";

/**
 * @param {string} className
 * @param {string} fileName
 * @returns
 */
const makeLink = function (className, fileName) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.className = className;
  link.href = fileName;
  return link;
};

/**
 * Loads a CSS file into <head>.
 * It concats settings.srcRoot with the first argument (cssFile)
 * @example:
 * css.load("/options/show_timestamps.css", "show_timestamps_link");
 *
 * @param {string} cssFile    the css file location
 * @param {string} className  class name for element
 * @returns {void}
 */
export function load(cssFile, className) {
  if (document.querySelector(`link.${className}`)) {
    // prevent from adding the same css file twice
    return;
  }
  const link = makeLink(
    className,
    // TIME_STAMP is created during build time
    settings.srcRoot + cssFile + "?" + import.meta.env.TIME_STAMP
  );
  document.head.appendChild(link);
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

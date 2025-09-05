import pkg from '../../package.json';
import { logError } from './logger';
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
 * @param {string} cssFile    the css file location
 * @param {string} className  class name for element
 * @param {string} specificVersion indicates a specific version to load
 * @returns {Promise<void>}
 */
export function link(cssFile, className, specificVersion = '') {
  cssFile = cssFile.replace(/^\//, ''); // remove leading slash
  return new Promise((resolve, reject) => {
    document.querySelector(`link.${className}`)?.remove();
    const cacheBuster = import.meta.env.DEV ? Date.now() : pkg.version;
    let cdnPath = 'DubPlus';
    if (specificVersion) {
      cdnPath += `@${specificVersion}`;
    }
    const link = makeLink(
      className,
      `${CDN_ROOT}/${cdnPath}/${cssFile}?${cacheBuster}`,
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

export async function loadDubPlusCSSforBookmarklet() {
  let version = '';
  const branch = import.meta.env.VITE_GIT_BRANCH?.trim();
  if (branch && branch !== 'main' && branch !== 'master') {
    // use branch name as version so that we can test develop, beta, etc.
    version = branch;
  } else if (!branch || branch === 'main' || branch === 'master') {
    // We first try and load the matching release version
    version = pkg.version;
  }

  try {
    await link('/dubplus.css', 'dubplus-css', version);
    // if this worked then we can stop here
    return;
  } catch (e) {
    logError(`Failed to load dubplus.css at version @${version}`, e);
  }

  // if we are here then we failed to load the specific version, so try latest
  try {
    await link('/dubplus.css', 'dubplus-css', 'latest');
  } catch (e) {
    logError('Failed to load dubplus.css', e);
  }
}

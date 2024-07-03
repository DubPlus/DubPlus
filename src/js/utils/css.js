'use strict';
var settings = require('../lib/settings.js');

var makeLink = function (className, FileName) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.className = className || '';
  link.href = FileName;
  return link;
};

function removeLink(className) {
  const link = document.querySelector(`link.${className}`);
  if (link) {
    link.remove();
  }
}

/**
 * Loads a CSS file into <head>.  It concats settings.srcRoot with the first argument (cssFile)
 * @param {string} cssFile    the css file location
 * @param {string} className  class name for element
 *
 * example:  css.load("/options/show_timestamps.css", "show_timestamps_link");
 */
var load = function (cssFile, className) {
  if (!cssFile) {
    return;
  }
  removeLink(className);
  var link = makeLink(className, settings.srcRoot + cssFile + '?' + TIME_STAMP);
  document.head.appendChild(link);
};

/**
 * Loads a css file from a full URL in the <head>
 * @param  {String} cssFile   the full url location of a CSS file
 * @param  {String} className a class name to give to the <link> element
 * @return {undefined}
 */
var loadExternal = function (cssFile, className) {
  if (!cssFile) {
    return;
  }
  removeLink(className);
  var link = makeLink(className, cssFile);
  document.head.appendChild(link);
};

module.exports = {
  load: load,
  loadExternal: loadExternal,
};

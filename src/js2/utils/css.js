import settings from './UserSettings.js';

var makeLink = function(className, FileName){
  var link = document.createElement('link');
  link.rel = "stylesheet"; link.type = "text/css";
  link.className = className || '';
  link.href = FileName;
  return link;
};

/**
 * Loads a CSS file into <head>.  It concats settings.srcRoot with the first argument (cssFile)
 * @param {string} cssFile    the css file location
 * @param {string} className  class name for element
 *
 * example:  css.load("/options/show_timestamps.css", "show_timestamps_link");
 */
function load(cssFile, className){
  if (!cssFile) {return;}
  var link = makeLink(className, settings.settings.srcRoot + cssFile + "?" + _TIME_STAMP_);
  document.head.insertAdjacentElement('beforeend', link);
}

/**
 * Loads a css file from a full URL in the <head>
 * @param  {String} cssFile   the full url location of a CSS file
 * @param  {String} className a class name to give to the <link> element
 * @return {undefined}           
 */
function loadExternal(cssFile, className){
  if (!cssFile) {return;}
  var link = makeLink(className, cssFile);
  document.head.insertAdjacentElement('beforeend', link);
}

export default {
  load : load,
  loadExternal : loadExternal
}
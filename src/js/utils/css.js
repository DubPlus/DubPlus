'use strict';
var settings = require("../lib/settings.js");

/**
 * Loads a CSS file into <head>.  It concats settings.srcRoot with the first argument (cssFile)
 * @param {string} cssFile    the css file location
 * @param {string} className  class name for element
 *
 * example:  css.load("/options/show_timestamps.css", "show_timestamps_link");
 */
var load = function(cssFile, className){
  if (!cssFile) {return;}
  var src =  settings.srcRoot + cssFile;
  var cn = 'class="'+className+'"' || '';
  $('head').append('<link '+cn+' rel="stylesheet" type="text/css" href="'+src+'">');
};

/**
 * Loads a css file from a full URL in the <head>
 * @param  {String} cssFile   the full url location of a CSS file
 * @param  {String} className a class name to give to the <link> element
 * @return {undefined}           
 */
var loadExternal = function(cssFile, className){
  if (!cssFile) {return;}
  var cn = 'class="'+className+'"' || '';
  $('head').append('<link '+cn+' rel="stylesheet" type="text/css" href="'+cssFile+'">');
};

module.exports = {
  load : load,
  loadExternal: loadExternal
};
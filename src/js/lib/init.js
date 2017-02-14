'use strict';
var modules = require('./loadModules.js');
var css = require('../utils/css.js');
var menu = require('./menu.js');

module.exports = function(){
  // load our main CSS
  css.load('/css/dubplus.css');

  // add a 'global' css class just in case we need more specificity in our css
  $('html').addClass('dubplus');

  // load third party snowfall feature
  $.getScript('https://rawgit.com/loktar00/JQuery-Snowfall/master/src/snowfall.jquery.js');

  // what is this for?
  // $('.icon-mute.snooze_btn:after').css({"content": "1", "vertical-align": "top", "font-size": "0.75rem", "font-weight": "700"});

  // make menu before loading the modules
  var menuString = menu.beginMenu();

  // load all our modules into the 'dubplus' global object
  // it also builds the menu dynamically
  // returns an object to be passed to menu.finish
  var menuObj = modules.loadAllModulesTo('dubplus');

  // finalize the menu and add it to the UI
  menu.finishMenu(menuObj, menuString);

  // dubplus.previewListInit();
  // dubplus.userAutoComplete();
};
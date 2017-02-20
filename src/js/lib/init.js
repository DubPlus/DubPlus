import loadAllModules from './loadModules.js';
var css = require('../utils/css.js');
var menu = require('./menu.js');

import snooze from '../modules/snooze.js';
import eta from '../modules/eta.js';

module.exports = function(){
  // load our main CSS
  css.load('/css/dubplus.css');

  // add a 'global' css class just in case we need more specificity in our css
  $('html').addClass('dubplus');

  // load third party snowfall feature
  $.getScript('https://rawgit.com/loktar00/JQuery-Snowfall/master/src/snowfall.jquery.js');

  // Get the opening html for the menu
  var menuString = menu.beginMenu();

  // load all our modules into the 'dubplus' global object
  // it also builds the menu dynamically
  // returns an object to be passed to menu.finish
  var menuObj = loadAllModules();

  // finalize the menu and add it to the UI
  menu.finishMenu(menuObj, menuString);

  // run non-menu related items here:
  snooze();
  eta();
  $('.dubplus-menu').perfectScrollbar();
};
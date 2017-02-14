'use strict';
var modules = require('./loadModules.js');
var css = require('../utils/css.js');
var menu = require('./menu.js');

/*
  The following are elements that are always done on load
*/

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

  // I'm not sure we need this anymore now that they added
  // $('.chat-main').on('DOMNodeInserted', function(e) {
  //     var itemEl = $(e.target);
  //     if(itemEl.prop('tagName').toLowerCase() !== 'li' || itemEl.attr('class').substring(0, 'user-'.length) !== 'user-') return;
  //     var user = Dubtrack.room.users.collection.findWhere({userid: itemEl.attr('class').split(/-| /)[1]});
  //     var role = !user.get('roleid') ? 'default' : Dubtrack.helpers.isDubtrackAdmin(user.get('userid')) ? 'admin' : user.get('roleid').type;
  //     itemEl.addClass('is' + (role.charAt(0).toUpperCase() + role.slice(1)));
  // });

};
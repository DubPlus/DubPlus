'use strict';
/* global Dubtrack */
var convertSettings = require('./convertSettings.js');
var modules = require('./loadModules.js');
var css = require('../utils/css.js');
var menu = require('./menu.js');

/*
  The following are elements that are always done on load
*/

module.exports = function(){
  $('.isUser').text(Dubtrack.session.get('username'));

  css.load('/css/options/dubinfo.css');

  convertSettings.go();
  convertSettings.delOldSettings();

  $('html').addClass('dubplus');

  $.getScript('https://rawgit.com/loktar00/JQuery-Snowfall/master/src/snowfall.jquery.js');

  $('.icon-mute.snooze_btn:after').css({"content": "1", "vertical-align": "top", "font-size": "0.75rem", "font-weight": "700"});

  // click event on the dubplus icon in the upper right which shows the whole menu
  $('.for').click(function() {
      $('.for_content').show();
  });

  // make menu before loading the modules
  menu.makeMenu();

  modules.loadAllModulesTo('dubplus');

  // dubplus.previewListInit();

  // dubplus.userAutoComplete();

  // Ref 5:
  $('.chat-main').on('DOMNodeInserted', function(e) {
      var itemEl = $(e.target);
      if(itemEl.prop('tagName').toLowerCase() !== 'li' || itemEl.attr('class').substring(0, 'user-'.length) !== 'user-') return;
      var user = Dubtrack.room.users.collection.findWhere({userid: itemEl.attr('class').split(/-| /)[1]});
      var role = !user.get('roleid') ? 'default' : Dubtrack.helpers.isDubtrackAdmin(user.get('userid')) ? 'admin' : user.get('roleid').type;
      itemEl.addClass('is' + (role.charAt(0).toUpperCase() + role.slice(1)));
  });

};
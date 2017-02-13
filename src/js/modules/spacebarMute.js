/**
 * Spacebar Mute
 * Turn on/off the ability to mute current song with the spacebar
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");

var myModule = {};

myModule.id = "spacebar_mute";
myModule.moduleName = "Spacebar Mute";
myModule.description = "Turn on/off the ability to mute current song with the spacebar.";
myModule.optionState = false;
myModule.category = "settings";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);


myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;

    $(document).bind('keypress.key32', function() {
      var tag = event.target.tagName.toLowerCase();
      if (event.which === 32 && tag !== 'input' && tag !== 'textarea') {
          $('#main_player .player_sharing .player-controller-container .mute').click();
      }
    });
  } else {
    newOptionState = false;
    $(document).unbind("keypress.key32");
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
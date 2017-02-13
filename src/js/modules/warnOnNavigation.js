/**
 * Warn on Navigation
 * Warns you when accidentally clicking on a link that takes you out of dubtrack
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");

var myModule = {};

myModule.id = "warn_redirect";
myModule.moduleName = "Warn On Navigation";
myModule.description = "Warns you when accidentally clicking on a link that takes you out of dubtrack.";
myModule.optionState = false;
myModule.category = "settings";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);


myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;

    window.onbeforeunload = function(e) {
      return '';
    };
  } else {
    newOptionState = false;
    window.onbeforeunload = null;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
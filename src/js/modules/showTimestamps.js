/**
 * Show Timestamps
 * Toggle always showing chat message timestamps.
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var css = require('../utils/css.js');

var myModule = {};

myModule.id = "show_timestamps";
myModule.moduleName = "Show Timestamps";
myModule.description = "Toggle always showing chat message timestamps.";
myModule.optionState = false;
myModule.category = "settings";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);


myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    css.load( "/css/options/show_timestamps.css", "show_timestamps_link");
  } else {
    newOptionState = false;
    $('.show_timestamps_link').remove();
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
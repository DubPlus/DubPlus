/**
 * Dubs in Chat
 * Show down o
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var css = require('../utils/css.js');

var myModule = {};

myModule.id = "video_window";
myModule.moduleName = "Hide Chat";
myModule.description = "Toggle hiding of the chat box.";
myModule.optionState = false;
myModule.category = "ui";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);


myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    css.load('/css/options/video_window.css', 'video_window_link');
  } else {
    newOptionState = false;
    $('.video_window_link').remove();
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
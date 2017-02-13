/**
 * Hide Avatars
 * Toggle hiding user avatars in the chat box.
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var css = require('../utils/css.js');

var myModule = {};

myModule.id = "hide_avatars";
myModule.moduleName = "Hide Avatars";
myModule.description = "Toggle hiding user avatars in the chat box.";
myModule.optionState = false;
myModule.category = "ui";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);


myModule.go = function() {
  var newOptionState;

  if(!this.optionState) {
    newOptionState= true;
    css.load('/css/options/hide_avatars.css', 'hide_avatars_link');
  } else {
    newOptionState= false;
    $('.hide_avatars_link').remove();
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
/**
 * Hide Background
 * toggle hiding background image
 */

/* global Dubtrack */
var menu = require('../lib/menu.js');
var settings = require("../lib/settings.js");

var myModule = {};

myModule.id = "medium_disable";
myModule.moduleName = "Hide Background";
myModule.description = "Toggle hiding background image.";
myModule.optionState = false;
myModule.category = "ui";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);


myModule.go = function() {
  var newOptionState;

  if(!this.optionState) {
    newOptionState= true;
    $('.backstretch').hide();
    $('.medium').hide();
  } else {
    newOptionState= false;
    $('.backstretch').show();
    $('.medium').show();
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
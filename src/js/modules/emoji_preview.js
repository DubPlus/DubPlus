var menu = require('../lib/menu.js');

var myModule = {};

myModule.id = "emoji_preview";
myModule.moduleName = "Autocomplete Emoji";
myModule.description = "Toggle snow.";
myModule.optionState = false;
myModule.category = "general";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);

// this function will be run on each click of the menu
myModule.go = function(e){
  var newOptionState;

  if (!this.optionState) {
      newOptionState = true;
  } else {
      newOptionState = false;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
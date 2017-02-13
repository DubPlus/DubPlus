/**
 * Split Chat
 * Toggle Split chat mode
 */

var menu = require('../lib/menu.js');

var myModule = {};

myModule.id = "split_chat";
myModule.moduleName = "Split Chat";
myModule.description = "Toggle Split Chat UI enhancement";
myModule.optionState = false;
myModule.category = "ui";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);



myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('.chat-main').addClass('splitChat');

  } else {
    newOptionState = false;
    $('.chat-main').removeClass('splitChat');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
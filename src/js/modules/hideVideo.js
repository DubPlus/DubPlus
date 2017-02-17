/**
 * Dubs in Chat
 * Show down o
 */

var myModule = {};
myModule.id = "dubplus-chat-only";
myModule.moduleName = "Hide Video";
myModule.description = "Toggles hiding the video box";
myModule.category = "User Interface";

myModule.init = function(){
  if (this.optionState) {
    $('body').addClass('dubplus-chat-only');
  }
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('body').addClass('dubplus-chat-only');
  } else {
    newOptionState = false;
    $('body').removeClass('dubplus-chat-only');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
/**
 * Dubs in Chat
 * Show down o
 */

var myModule = {};
myModule.id = "dubplus-video-only";
myModule.moduleName = "Hide Chat";
myModule.description = "Toggles hiding the chat box";
myModule.category = "User Interface";

myModule.init = function(){
  if (this.optionState) {
    $('body').addClass('dubplus-video-only');
  }
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('body').addClass('dubplus-video-only');
  } else {
    newOptionState = false;
    $('body').removeClass('dubplus-video-only');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
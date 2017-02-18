/**
 * Split Chat
 * Toggle Split chat mode
 */

var myModule = {};
myModule.id = "dubplus-split-chat";
myModule.moduleName = "Split Chat";
myModule.description = "Toggle Split Chat UI enhancement";
myModule.category = "User Interface";

myModule.init = function(){
  if (this.optionState) {
    $('body').addClass('dubplus-split-chat');
  }
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('body').addClass('dubplus-split-chat');

  } else {
    newOptionState = false;
    $('body').removeClass('dubplus-split-chat');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
/**
 * Split Chat
 * Toggle Split chat mode
 */

var myModule = {};
myModule.id = "dubplus-split-chat";
myModule.moduleName = "Split Chat";
myModule.description = "Toggle Split Chat UI enhancement";
myModule.category = "User Interface";

myModule.turnOn = function(){
  $('body').addClass('dubplus-split-chat');
};

myModule.go = function() {
  $('body').removeClass('dubplus-split-chat');
};

module.exports = myModule;
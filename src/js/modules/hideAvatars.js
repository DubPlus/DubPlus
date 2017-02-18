/**
 * Hide Avatars
 * Toggle hiding user avatars in the chat box.
 */
var myModule = {};

myModule.id = "dubplus-hide-avatars";
myModule.moduleName = "Hide Avatars";
myModule.description = "Toggle hiding user avatars in the chat box.";
myModule.category = "User Interface";

myModule.init = function(){
  if (this.optionState) {
    $('body').addClass('dubplus-hide-avatars');
  }
};

myModule.go = function() {
  var newOptionState;

  if(!this.optionState) {
    newOptionState= true;
    $('body').addClass('dubplus-hide-avatars');
  } else {
    newOptionState= false;
    $('body').removeClass('dubplus-hide-avatars');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
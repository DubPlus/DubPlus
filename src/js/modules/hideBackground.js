/**
 * Hide Background
 * toggle hiding background image
 */

var myModule = {};
myModule.id = "dubplus-hide-bg";
myModule.moduleName = "Hide Background";
myModule.description = "Toggle hiding background image.";
myModule.category = "User Interface";

myModule.init = function() {
  if (this.optionState) {
    $('body').addClass('dubplus-hide-bg');
  }
};

myModule.go = function() {
  var newOptionState;

  if(!this.optionState) {
    newOptionState= true;
    $('body').addClass('dubplus-hide-bg');
  } else {
    newOptionState= false;
    $('body').removeClass('dubplus-hide-bg');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
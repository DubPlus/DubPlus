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
    $('.backstretch').hide();
    $('.medium').hide();
  }
};

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
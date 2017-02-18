/**
 * Show Timestamps
 * Toggle always showing chat message timestamps.
 */

var myModule = {};
myModule.id = "dubplus-show-timestamp";
myModule.moduleName = "Show Timestamps";
myModule.description = "Toggle always showing chat message timestamps.";
myModule.category = "User Interface";

myModule.init = function() {
  if (this.optionState) {
    $('body').addClass('dubplus-show-timestamp');
  }
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    $('body').addClass('dubplus-show-timestamp');
  } else {
    newOptionState = false;
    $('body').removeClass('dubplus-show-timestamp');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
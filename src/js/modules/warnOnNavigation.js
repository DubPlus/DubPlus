/**
 * Warn on Navigation
 * Warns you when accidentally clicking on a link that takes you out of dubtrack
 */

var myModule = {};

myModule.id = "warn_redirect";
myModule.moduleName = "Warn On Navigation";
myModule.description = "Warns you when accidentally clicking on a link that takes you out of dubtrack.";
myModule.category = "Settings";

myModule.start = function() {
  window.onbeforeunload = function(e) {
      return '';
    };
};

myModule.init = function(){
  if (this.optionState) {
    this.start();
  }
};

myModule.go = function() {
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    this.start();
  } else {
    newOptionState = false;
    window.onbeforeunload = null;
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
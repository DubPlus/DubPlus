/**
 * Warn on Navigation
 * Warns you when accidentally clicking on a link that takes you out of dubtrack
 */

var myModule = {};

myModule.id = "warn_redirect";
myModule.moduleName = "Warn On Navigation";
myModule.description = "Warns you when accidentally clicking on a link that takes you out of dubtrack.";
myModule.category = "Settings";

function unloader(e) {
  var confirmationMessage = "";
  e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
  return confirmationMessage;              // Gecko, WebKit, Chrome <34
}

myModule.turnOn = function() {
  window.addEventListener("beforeunload", unloader);

};

myModule.turnOff = function() {
  window.removeEventListener("beforeunload", unloader);
};

module.exports = myModule;
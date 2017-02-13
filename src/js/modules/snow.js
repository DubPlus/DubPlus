var menu = require('../lib/menu.js');

var myModule = {};

myModule.id = "snow";
myModule.moduleName = "Snow";
myModule.description = "Toggle snow.";
myModule.optionState = false;
myModule.category = "general";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);

// this function will be run on each click of the menu
myModule.go = function(e){
  var newOptionState;

  if (!this.optionState) {
      newOptionState = true;
      $(document).snowfall({
          round: true,
          shadow: true,
          flakeCount: 50,
          minSize: 1,
          maxSize: 5,
          minSpeed: 5,
          maxSpeed: 5
      });
  } else {
      newOptionState= false;
      $(document).snowfall('clear');
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
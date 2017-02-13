var menu = require('../lib/menu.js');

var snow = {};

snow.id = "dubplus-snow";
snow.moduleName = "Snow";
snow.description = "Make it snow!";
snow.optionState = false;
snow.category = "General";
snow.menuHTML = menu.makeOptionMenu(snow.moduleName, {
    id : snow.id,
    desc : snow.description
  });

// this function will be run on each click of the menu
snow.go = function(e){
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

module.exports = snow;
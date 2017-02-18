/**
 * Community Theme
 * Toggle Community CSS theme
 */

/* global Dubtrack */
var css = require('../utils/css.js');

var myModule = {};
myModule.id = "dubplus-comm-theme";
myModule.moduleName = "Community Theme";
myModule.description = "Toggle Community CSS theme.";
myModule.category = "Customize";

myModule.start = function(){
  var location = Dubtrack.room.model.get('roomUrl');
  $.ajax({
    type: 'GET',
    url: 'https://api.dubtrack.fm/room/'+location,
  }).done(function(e) {
    var content = e.data.description;
    
    // for backwards compatibility with dubx we're checking for both @dubx and @dubplus
    var themeCheck = new RegExp(/(@dub[x|plus]=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/,'i');
    var communityCSSUrl = null;
    content.replace(themeCheck, function(match, p1, p2){
      console.log('loading community css theme:',p2);
      communityCSSUrl = p2;
    });

    if(!communityCSSUrl) {return;}
    css.loadExternal(communityCSSUrl, 'dubplus-comm-theme');
  });
};

myModule.init = function(){
  if (this.optionState){
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
    $('.dubplus-comm-theme').remove();
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

module.exports = myModule;
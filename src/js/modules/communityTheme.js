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

myModule.turnOn = function(){
  var location = QueUp.room.model.get('roomUrl');
  $.ajax({
    type: 'GET',
    url: 'https://api.queup.net/room/'+location,
  }).done(function(e) {
    var content = e.data.description;
    
    // for backwards compatibility with dubx we're checking for both @dubx and @dubplus and @dub+
    var themeCheck = new RegExp(/(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/,'i');
    var communityCSSUrl = null;
    content.replace(themeCheck, function(match, p1, p2, p3){
      console.log('loading community css theme:',p3);
      communityCSSUrl = p3;
    });

    if(!communityCSSUrl) {return;}
    css.loadExternal(communityCSSUrl, 'dubplus-comm-theme');
  });
};

myModule.turnOff = function() {
  $('.dubplus-comm-theme').remove();
};

module.exports = myModule;
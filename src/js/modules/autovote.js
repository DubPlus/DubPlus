/* global Dubtrack */
var menu = require('../lib/menu.js');

var myModule = {};

myModule.id = "autovote";
myModule.moduleName = "Autovote";
myModule.description = "Toggles support for auto upvoting for every song";
myModule.optionState = false;
myModule.category = "general";
myModule.menuHTML = menu.makeStandardMenuHTML(myModule.id, myModule.description, myModule.id, myModule.moduleName);

// this function will be run on each click of the menu
myModule.go = function(e){
  var newOptionState;
  
  if (!this.optionState) {
      newOptionState = true;

      var song = Dubtrack.room.player.activeSong.get('song');
      var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
      var dubsong = Dubtrack.helpers.cookie.get('dub-song');

      if (!Dubtrack.room || !song || song.songid !== dubsong) {
          dubCookie = false;
      }
      //Only cast the vote if user hasn't already voted
      if (!$('.dubup, .dubdown').hasClass('voted') && !dubCookie) {
          this.advance_vote();
      }

      Dubtrack.Events.bind("realtime:room_playlist-update", this.voteCheck);
  } else {
      newOptionState = false;
      Dubtrack.Events.unbind("realtime:room_playlist-update", this.voteCheck);
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

// add any custom functions to this module
myModule.advance_vote = function() {
  $('.dubup').click();
};

myModule.voteCheck = function (obj) {
  if (obj.startTime < 2) {
      this.advance_vote();
  }
};

module.exports = myModule;
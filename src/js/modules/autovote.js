/* global Dubtrack */
var menu = require('../lib/menu.js');

var autovote = {};

autovote.id = "dubplus-autovote";
autovote.moduleName = "Autovote";
autovote.description = "Toggles auto upvoting for every song";
autovote.optionState = false;
autovote.category = "General";
autovote.menuHTML = menu.makeOptionMenu(autovote.moduleName, {
    id : autovote.id,
    desc : autovote.description
  });

// this function will be run on each click of the menu
autovote.go = function(e){
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
autovote.advance_vote = function() {
  $('.dubup').click();
};

autovote.voteCheck = function (obj) {
  if (obj.startTime < 2) {
      this.advance_vote();
  }
};

module.exports = autovote;
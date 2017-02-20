/* global Dubtrack */
var autovote = {};
autovote.id = "dubplus-autovote";
autovote.moduleName = "Autovote";
autovote.description = "Toggles auto upvoting for every song";
autovote.category = "General";

/*******************************************************/
// add any custom functions to this module

var advance_vote = function() {
  $('.dubup').click();
};

var voteCheck = function (obj) {
  if (obj.startTime < 2) {
    advance_vote();
  }
};

/*******************************************************/

autovote.init = function(){
  if (this.optionState === true) {
    this.start();
  }
};

// this function will be run on each click of the menu
autovote.go = function(){
  var newOptionState;

  if (!this.optionState) {
    newOptionState = true;
    this.start();
  } else {
    newOptionState = false;
    Dubtrack.Events.unbind("realtime:room_playlist-update", voteCheck);
  }

  this.optionState = newOptionState;
  this.toggleAndSave(this.id, newOptionState);
};

autovote.start = function(){
  var song = Dubtrack.room.player.activeSong.get('song');
  var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
  var dubsong = Dubtrack.helpers.cookie.get('dub-song');

  if (!Dubtrack.room || !song || song.songid !== dubsong) {
    dubCookie = false;
  }
  //Only cast the vote if user hasn't already voted
  if (!$('.dubup, .dubdown').hasClass('voted') && !dubCookie) {
    advance_vote();
  }

  Dubtrack.Events.bind("realtime:room_playlist-update", voteCheck);
};


module.exports = autovote;
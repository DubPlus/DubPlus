/* global Dubtrack */
var autovote = {};
autovote.id = "dubplus-autovote";
autovote.moduleName = "Autovote";
autovote.description = "Toggles auto upvoting for every song";
autovote.category = "General";

/*******************************************************/
// add any custom functions to this module

var advance_vote = function() {
  if (QueUp && QueUp.playerController && QueUp.playerController.voteUp) {
    console.log('voting');
    QueUp.playerController.voteUp.click();
  }
};

var voteCheck = function (obj) {
  if (obj.startTime < 2) {
    advance_vote();
  }
};

/*******************************************************/

autovote.turnOff = function() {
  QueUp.Events.unbind("realtime:room_playlist-update", voteCheck);
};

autovote.turnOn = function(){
  var song = QueUp.room.player.activeSong.get('song');
  var dubCookie = QueUp.helpers.cookie.get('dub-' + QueUp.room.model.get("_id"));
  var dubsong = QueUp.helpers.cookie.get('dub-song');

  if (!QueUp.room || !song || song.songid !== dubsong) {
    dubCookie = false;
  }
  //Only cast the vote if user hasn't already voted
  if (!$('.dubup, .dubdown').hasClass('voted') && !dubCookie) {
    advance_vote();
  }

  QueUp.Events.bind("realtime:room_playlist-update", voteCheck);
};


module.exports = autovote;
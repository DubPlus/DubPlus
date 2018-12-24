/* global Dubtrack */
var autovote = {};
autovote.id = "dubplus-autovote";
autovote.moduleName = "Autovote";
autovote.description = "Toggles auto upvoting for every song";
autovote.category = "General";

/*******************************************************/
// add any custom functions to this module

var advance_vote = function() {
  console.log('voting');
  Dubtrack.playerController.voteUp.click();
};

var voteCheck = function (obj) {
  console.log('checking vote', obj);
  if (obj.startTime < 2) {
    advance_vote();
  }
};

/*******************************************************/

autovote.turnOff = function() {
  Dubtrack.Events.unbind("realtime:room_playlist-update", voteCheck);
};

autovote.turnOn = function(){
  var song = Dubtrack.room.player.activeSong.get('song');
  var dubCookie = Dubtrack.helpers.cookie.get('dub-' + Dubtrack.room.model.get("_id"));
  var dubsong = Dubtrack.helpers.cookie.get('dub-song');

  if (!Dubtrack.room || !song || song.songid !== dubsong) {
    dubCookie = false;
  }
  //Only cast the vote if user hasn't already voted
  if (!$('.dubup, .dubdown').hasClass('voted') && !dubCookie) {
    advance_vote();
  } else {
    console.log('turned on but not voting', $('.dubup, .dubdown').hasClass('voted'), dubCookie);
  }

  Dubtrack.Events.bind("realtime:room_playlist-update", voteCheck);
};


module.exports = autovote;
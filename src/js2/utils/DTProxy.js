/*
In order to prepare for the future alpha changes and the possibility that Dubtrack might
alter this object of data we rely on, I am planning to funnel all interaction with
Dubtrack through this "proxy" (for lack of better word)
*/

class DTProxy {
  getSessionId() {
    return Dubtrack.session.id;
  }

  getUserName() {
    return Dubtrack.session.get("username");
  }

  getRoomUrl() {
    return Dubtrack.room.model.get("roomUrl");
  }

  setVolume(vol) {
    Dubtrack.room.player.setVolume(vol);
    Dubtrack.room.player.updateVolumeBar();
  }

  getVolume() {
    return Dubtrack.playerController.volume;
  }

  isMuted() {
    return Dubtrack.room.player.muted_player;
  }

  mutePlayer() {
    Dubtrack.room.player.mutePlayer();
  }

  getChatSoundUrl() {
    return Dubtrack.room.chat.mentionChatSound.url;
  }
  setChatSoundUrl(url) {
    Dubtrack.room.chat.mentionChatSound.url = url;
  }
  playChatSound() {
    Dubtrack.room.chat.mentionChatSound.play();
  }
  sendChatMessage() {
    Dubtrack.room.chat.sendMessage();
  }
  modCheck(userid) {
    return (
      Dubtrack.helpers.isDubtrackAdmin(userid) ||
      Dubtrack.room.users.getIfOwner(userid) ||
      Dubtrack.room.users.getIfManager(userid) ||
      Dubtrack.room.users.getIfMod(userid)
    );
  }

  displayUserGrab() {
    return Dubtrack.room.model.get("displayUserGrab");
  }

  getSongName() {
    return Dubtrack.room.player.activeSong.attributes.songInfo.name;
  }

  getDubSong() {
    return Dubtrack.helpers.cookie.get("dub-song");
  }

  getActiveSong() {
    return Dubtrack.room.player.activeSong.get("song");
  }

  /**
   * returns wether user has "updub" or "downdub" current song
   */
  getVoteType() {
    return Dubtrack.helpers.cookie.get("dub-" + Dubtrack.room.model.get("_id"));
  }

  getCurrentDJ() {
    return Dubtrack.room.users.collection.findWhere({
      userid: Dubtrack.room.player.activeSong.attributes.song.userid
    }).attributes._user.username;
  }

  // EVENTS
  onPlaylistUpdate(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-update", cb);
  }
  offPlaylistUpdate(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-update", cb);
  }

  onSongVote(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-dub", cb);
  }
  offSongVote(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-dub", cb);
  }

  onChatMessage(cb) {
    Dubtrack.Events.bind("realtime:chat-message", cb);
  }
  offChatMessage(cb) {
    Dubtrack.Events.unbind("realtime:chat-message", cb);
  }

  onSongGrab(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", cb);
  }
  offSongGrab(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", cb);
  }
}

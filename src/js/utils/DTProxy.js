/*
In order to prepare for the future alpha changes and the possibility that Dubtrack might
alter this object of data we rely on, I am planning to funnel all interaction with
Dubtrack through this "proxy" (for lack of better word)
*/
import WaitFor from "@/utils/waitFor.js";

class DTProxy {

  loadCheck() {
    var checkList = [
      "Dubtrack.session.id",
      "Dubtrack.room.chat",
      "Dubtrack.Events",
      "Dubtrack.room.player",
      "Dubtrack.helpers.cookie",
      "Dubtrack.room.model",
      "Dubtrack.room.users"
    ];

    return new WaitFor(checkList, { seconds: 120 });
  }

  activeDubsAPI() {
    return `https://api.dubtrack.fm/room/${this.getRoomId()}/playlist/active/dubs`;
  }
  userDataAPI(userid) {
    return "https://api.dubtrack.fm/user/" + userid;
  }

  getSessionId() {
    return Dubtrack.session.id;
  }

  /**
   * get the current logged in user name
   */
  getUserName() {
    return Dubtrack.session.get("username");
  }

  getRoomUrl() {
    return Dubtrack.room.model.get("roomUrl");
  }

  getRoomId() {
    return Dubtrack.room.model.id;
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

  modCheck(userid = Dubtrack.session.id) {
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

  /**
   * Get the Dubtrack ID for current song.
   */
  getDubSong() {
    return Dubtrack.helpers.cookie.get("dub-song");
  }

  /**
   * Get song data for the current song
   */
  getActiveSong() {
    return Dubtrack.room.player.activeSong.get("song");
  }

  /**
   * returns wether user has "updub" or "downdub" current song
   */
  getVoteType() {
    return Dubtrack.helpers.cookie.get("dub-" + Dubtrack.room.model.id);
  }

  getCurrentDJ() {
    return Dubtrack.room.users.collection.findWhere({
      userid: Dubtrack.room.player.activeSong.attributes.song.userid
    }).attributes._user.username;
  }

  getUserInfo(userid) {
    return Dubtrack.room.users.collection.findWhere({ userid: userid });
  }

  /******************************************************************
   * Dubtrack Events
   */

  /**
   * When the room's current song changes and a new song comes on
   * @param {function} cb callback function to bind to playlist-update
   */
  onPlaylistUpdate(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-update", cb);
  }
  offPlaylistUpdate(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-update", cb);
  }

  /**
   * When a user up/down votes (aka dub) a song
   */
  onSongVote(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-dub", cb);
  }
  offSongVote(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-dub", cb);
  }

  /**
   * When a new chat message comes in
   */
  onChatMessage(cb) {
    Dubtrack.Events.bind("realtime:chat-message", cb);
  }
  offChatMessage(cb) {
    Dubtrack.Events.unbind("realtime:chat-message", cb);
  }

  /**
   * When any user in the room grabs a song
   */
  onSongGrab(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", cb);
  }
  offSongGrab(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", cb);
  }

  onUserLeave(cb) {
    Dubtrack.Events.bind("realtime:user-leave", cb);
  }
  offUserLeave(cb) {
    Dubtrack.Events.unbind("realtime:user-leave", cb);
  }

  onNewPM(cb) {
    Dubtrack.Events.bind("realtime:new-message", cb);
  }
  offNewPM(cb) {
    Dubtrack.Events.unbind("realtime:new-message", cb);
  }

  /******************************************************************
   * Functions that depend on, or return, DOM elements
   * for now I'm only proying DOM elements used across multiple files
   * Except if they are just used as Preact's render target:  render(<Elem>, target)
   */

  chatInput() {
    return document.getElementById("chat-txt-message");
  }

  chatList() {
    return document.querySelector("ul.chat-main");
  }

  allChatTexts() {
    return document.querySelectorAll(".chat-main .text");
  }

  // this is the little input that's in the grabs popup
  playlistInput() {
    return document.getElementById("playlist-input");
  }

  // this is the list of playlists in the grab popup
  grabPlaylists() {
    return document.querySelectorAll(".playlist-list-action li");
  }

  /**
   * Get the current minutes remaining of the song playing
   */
  getRemainingTime() {
    return parseInt(
      document.querySelector("#player-controller .currentTime span.min")
        .textContent
    );
  }

  // booth duration?
  getQueuePosition() {
    return parseInt(this.getQueuePositionElem().textContent);
  }
  // booth duration?
  getQueuePositionElem() {
    return document.querySelector(".queue-position");
  }

  getPMmsg(messageid) {
    return document.querySelector(
      `.message-item[data-messageid="${messageid}"]`
    );
  }

  upVote() {
    return document.querySelector(".dubup");
  }
  downVote() {
    return document.querySelector(".dubdown");
  }
  grabBtn() {
    return document.querySelector(".add-to-playlist-button");
  }

  userPMs() {
    return document.querySelector(".user-messages");
  }

  bgImg() {
    return document.querySelector(".backstretch-item img");
  }

  hideVideoBtn() {
    return document.querySelector(".hideVideo-el");
  }

  /*
    some more DOM elements being access but only has render targets for Preact
    going to leave them out for now

    document.querySelector('.player_sharing')
    document.querySelector(".chat-text-box-icons")
    document.querySelector(".header-right-navigation")
    document.querySelector(".pusher-chat-widget-input");
    document.querySelector("#room-main-player-container");
   */
}

const proxy = new DTProxy();

export default proxy;

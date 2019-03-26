import WaitFor from "@/utils/waitFor.js";

/**
 * Proxy for anything that uses `window.Dubtrack` global object
 */

const DTGlobal = {
  /**
   * Begins polling of window object for the existence of a set of global
   * variables.
   *
   * @returns {Promise}
   */
  loadCheck() {
    var checkList = [
      "Dubtrack.session.id",
      "Dubtrack.room.chat",
      "Dubtrack.Events",
      "Dubtrack.room.player",
      "Dubtrack.helpers.cookie",
      "Dubtrack.room.model",
      "Dubtrack.room.users",
      "Dubtrack.config"
    ];

    return new WaitFor(checkList, { seconds: 120 });
  },

  /**
   * Session Id is the same as User ID apparently
   *
   * @returns {string}
   */
  sessionId() {
    return Dubtrack.session.id;
  },

  /**
   * pass through of session id which is the same as user id
   *
   * @returns {string}
   */
  userId() {
    return this.sessionId();
  },

  /**
   * get the current logged in user name
   *
   * @returns {string}
   */
  userName() {
    return Dubtrack.session.get("username");
  },

  /**
   * get current room's name from the URL. Just the name and not other part
   * of the URL and no slashes
   *
   * @returns {string}
   */
  roomUrlName() {
    return Dubtrack.room.model.get("roomUrl");
  },

  /**
   * returns the current room's id
   *
   * @returns {string}
   */
  roomId() {
    return Dubtrack.room.model.id;
  },

  /**
   * set volume of room's player
   *
   * @param {number} vol - number between 0 - 100
   */
  setVolume(vol) {
    Dubtrack.room.player.setVolume(vol);
    Dubtrack.room.player.updateVolumeBar();
  },

  /**
   * get the current volume of the room's player
   *
   * @returns {number}
   */
  getVolume() {
    return Dubtrack.playerController.volume;
  },

  /**
   * get the current mute state of the room's player
   *
   * @returns {boolean}
   */
  isMuted() {
    return Dubtrack.room.player.muted_player;
  },

  /**
   * mute the room's player
   *
   */
  mutePlayer() {
    Dubtrack.room.player.mutePlayer();
  },

  /**
   * Get the path of the mp3 file that is used for notifications
   *
   * @returns {string}
   */
  getChatSoundUrl() {
    return Dubtrack.room.chat.mentionChatSound.url;
  },

  /**
   * set the mp3 file that is used for notifications
   *
   * @param {string} url - the url of the mp3 file
   */
  setChatSoundUrl(url) {
    Dubtrack.room.chat.mentionChatSound.url = url;
  },

  /**
   * play the notification sound
   *
   */
  playChatSound() {
    Dubtrack.room.chat.mentionChatSound.play();
  },

  /**
   * This will take whatever text inside the input and send it to the chat
   *
   */
  sendChatMessage() {
    Dubtrack.room.chat.sendMessage();
  },

  /**
   * check if a user has mod (or higher) priviledges.
   *
   * @param {string} userid - any user's id, defaults to current logged in user
   */
  modCheck(userid = Dubtrack.session.id) {
    return (
      Dubtrack.helpers.isDubtrackAdmin(userid) ||
      Dubtrack.room.users.getIfOwner(userid) ||
      Dubtrack.room.users.getIfManager(userid) ||
      Dubtrack.room.users.getIfMod(userid)
    );
  },

  /**
   * Get room's "display grabs in chat" setting
   *
   * @returns {boolean}
   */
  displayUserGrab() {
    return Dubtrack.room.model.get("displayUserGrab");
  },

  /**
   * get song info for the currently playing song
   *
   * @returns {object}
   */
  getActiveSong() {
    return Dubtrack.room.player.activeSong.get("songInfo");
  },

  /**
   * get the name of the song that's currently playing in the room
   *
   * @returns {string}
   */
  getSongName() {
    return this.getActiveSong().name;
  },

  /**
   * Get current playing song's platform ID (aka fkid)
   *
   * @returns {string} should only ever return "youtube" or "soundcloud"
   */
  getSongFKID() {
    return this.getActiveSong().fkid;
  },

  /**
   * Get the Dubtrack ID for current song.
   *
   * @returns {string}
   */
  getDubSong() {
    return Dubtrack.helpers.cookie.get("dub-song");
  },

  /**
   * returns whether user has "updub"-ed or "downdub"-ed current song
   *
   * @returns {string|null} "updub", "downdub", or null if no vote was cast
   */
  getVoteType() {
    return Dubtrack.helpers.cookie.get("dub-" + Dubtrack.room.model.id);
  },

  /**
   * get the name of the current DJ
   *
   * @returns {string}
   */
  getCurrentDJ() {
    let user = Dubtrack.room.users.collection.findWhere({
      userid: Dubtrack.room.player.activeSong.attributes.song.userid
    });
    if (user) {
      return user.attributes._user.username;
    }
  },

  /**
   * get a user in the room's info
   *
   * @param {string} userid
   * @returns {object}
   */
  getUserInfo(userid) {
    return Dubtrack.room.users.collection.findWhere({ userid: userid });
  }
};

export default DTGlobal;

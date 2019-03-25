import WaitFor from "@/utils/waitFor.js";

/**
 * In order to prepare for the future alpha changes and the possibility that
 * Dubtrack might alter this object of data we rely on, I am planning to funnel
 * all interaction with Dubtrack through this "proxy" (for lack of better word)
 *
 * When proxying data that never really changes (like ids, api urls, DOM elements, etc)
 * I recommend using a getter function for a cleaner syntax when using it.
 * Use functions for items that change often (like getting all queue and active song
 * info, etc), or functions that require arguments (of course)
 * Use both getter & setters when it makes sense
 *
 * @class DTProxy
 */
class DTProxy {
  /**
   * Begins polling of window object for the existence of a set of global
   * variables.
   *
   * @returns {Promise}
   * @memberof DTProxy
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
      "Dubtrack.config.apiUrl"
    ];

    return new WaitFor(checkList, { seconds: 120 });
  }

  /******************************************************************
   * API urls
   */

  /**
   * Get Dubtrack's API url
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get apiUrl() {
    return Dubtrack.config.apiUrl;
  }

  /**
   * get the API url to get info about songs in the active queue
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get roomQueueDetails() {
    const id = this.roomId;
    return (
      this.apiUrl + Dubtrack.config.urls.roomQueueDetails.replace(":id", id)
    );
  }

  /**
   * API url to get song info
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get songAPI() {
    return this.apiUrl + Dubtrack.config.urls.song;
  }

  /**
   * returns the API URL for the active dubs in the current user is in
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */

  get activeDubsAPI() {
    return `${this.apiUrl}/${this.roomId}/playlist/active/dubs`;
  }

  /**
   * returns the API url to get a users info
   *
   * @param {string} userid - current logged in user id
   * @returns {string}
   * @memberof DTProxy
   */
  userDataAPI(userid) {
    return this.apiUrl + Dubtrack.config.urls.user + "/" + userid;
  }

  /**
   * API url for current room's info
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get roomInfoAPI() {
    return this.apiUrl + "/room/" + this.roomUrlName;
  }

  /**
   * get the avatar image of a user
   * @param {string} userid
   * @returns {string}
   */
  userImage(userid) {
    return `${this.apiUrl}/user/${userid}/image`;
  }

  /**
   * Session Id is the same as User ID apparently
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get sessionId() {
    return Dubtrack.session.id;
  }

  /**
   * pass through of session id which is the same as user id
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get userId() {
    return this.sessionId;
  }

  /**
   * get the current logged in user name
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get userName() {
    return Dubtrack.session.get("username");
  }

  /**
   * get current the room's name from the URL. Just the name and not other part
   * of the URL and no slashes
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get roomUrlName() {
    return Dubtrack.room.model.get("roomUrl");
  }

  /**
   * returns the current room's id
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get roomId() {
    return Dubtrack.room.model.id;
  }

  /**
   * set volume of room's player
   *
   * @param {number} vol - number between 0 - 100
   * @memberof DTProxy
   */
  set volume(vol) {
    Dubtrack.room.player.setVolume(vol);
    Dubtrack.room.player.updateVolumeBar();
  }

  /**
   * get the current volume of the room's player
   *
   * @readonly
   * @property {number}
   * @memberof DTProxy
   */
  get volume() {
    return Dubtrack.playerController.volume;
  }

  /**
   * get the current mute state of the room's player
   *
   * @readonly
   * @property {boolean}
   * @memberof DTProxy
   */
  get isMuted() {
    return Dubtrack.room.player.muted_player;
  }

  /**
   * mute the room's player
   *
   * @memberof DTProxy
   */
  mutePlayer() {
    Dubtrack.room.player.mutePlayer();
  }

  /**
   * Get the path of the mp3 file that is used for notifications
   *
   * @readonly
   * @property {string}
   * @memberof DTProxy
   */
  get chatSoundUrl() {
    return Dubtrack.room.chat.mentionChatSound.url;
  }

  /**
   * set the mp3 file that is used for notifications
   *
   * @param {string} url - the url of the mp3 file
   * @memberof DTProxy
   */
  set chatSoundUrl(url) {
    Dubtrack.room.chat.mentionChatSound.url = url;
  }

  /**
   * play the notification sound
   *
   * @memberof DTProxy
   */
  playChatSound() {
    Dubtrack.room.chat.mentionChatSound.play();
  }

  /**
   * This will take whatever text inside the input and send it to the chat
   *
   * @memberof DTProxy
   */
  sendChatMessage() {
    Dubtrack.room.chat.sendMessage();
  }

  /**
   * check if a user has mod (or higher) priviledges.
   *
   * @param {string} userid - any user's id, defaults to current logged in user
   * @memberof DTProxy
   */
  modCheck(userid = Dubtrack.session.id) {
    return (
      Dubtrack.helpers.isDubtrackAdmin(userid) ||
      Dubtrack.room.users.getIfOwner(userid) ||
      Dubtrack.room.users.getIfManager(userid) ||
      Dubtrack.room.users.getIfMod(userid)
    );
  }

  /**
   * Get room's "display grabs in chat" setting
   * @property {boolean}
   * @memberof DTProxy
   */
  get displayUserGrab() {
    return Dubtrack.room.model.get("displayUserGrab");
  }

  /**
   * get the name of the song that's currently playing in the room
   *
   * @returns {string}
   * @memberof DTProxy
   */
  getSongName() {
    return Dubtrack.room.player.activeSong.get("songInfo").name;
  }

  /**
   * Get current playing song's platform ID (aka fkid)
   *
   * @returns {string}
   * @memberof DTProxy
   */
  getSongFKID() {
    return Dubtrack.room.player.activeSong.get("songInfo").fkid;
  }

  /**
   * Get the Dubtrack ID for current song.
   *
   * @returns {string}
   * @memberof DTProxy
   */
  getDubSong() {
    return Dubtrack.helpers.cookie.get("dub-song");
  }

  /**
   * Get song data for the current song
   *
   * @returns {object}
   * @memberof DTProxy
   */
  getActiveSong() {
    return Dubtrack.room.player.activeSong.get("song");
  }

  /**
   * returns whether user has "updub"-ed or "downdub"-ed current song
   *
   * @returns {string|null} "updub", "downdub", or null if no vote was cast
   * @memberof DTProxy
   */
  getVoteType() {
    return Dubtrack.helpers.cookie.get("dub-" + Dubtrack.room.model.id);
  }

  /**
   * get the name of the current DJ
   *
   * @returns {string}
   * @memberof DTProxy
   */
  getCurrentDJ() {
    let user = Dubtrack.room.users.collection.findWhere({
      userid: Dubtrack.room.player.activeSong.attributes.song.userid
    });
    if (user) {
      return user.attributes._user.username;
    }
  }

  /**
   * get a user in the room's info
   *
   * @param {string} userid
   * @returns {object}
   * @memberof DTProxy
   */
  getUserInfo(userid) {
    return Dubtrack.room.users.collection.findWhere({ userid: userid });
  }

  /**
   * Make api call to get data for all the songs in the room's active queue
   *
   * @param {function} cb - callback function
   * @memberof DTProxy
   */
  getRoomQueue(cb) {
    this._handleAsync(this.roomQueueDetails, cb);
  }

  /**
   * make api call to get data for a specific song
   *
   * @param {string} songID
   * @param {function} cb - callback function
   * @memberof DTProxy
   */
  getSongData(songID, cb) {
    this._handleAsync(`${this.songAPI}/${songID}`, cb);
  }

  /**
   * meant for internal use only. Handles async calls to api urls using
   * fetch. Uses old school callbacks
   *
   * @private
   * @memberof DTProxy
   */
  _handleAsync(url, cb) {
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        if (json.code === 200) {
          cb(null, json);
        } else {
          cb(true, json);
        }
      })
      .catch(err => {
        cb(err, null);
      });
  }

  /******************************************************************
   * Dubtrack Events
   */

  /**
   * Subscribe to the room's current song changes including when a new song comes on
   *
   * @param {function} cb callback function to bind to playlist-update
   * @memberof DTProxy
   */
  onPlaylistUpdate(cb) {
    Dubtrack.Events.on("realtime:room_playlist-update", cb);
  }

  /**
   * unsubscribe to playlist updates
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offPlaylistUpdate(cb) {
    Dubtrack.Events.off("realtime:room_playlist-update", cb);
  }

  /**
   * Subscribe to changes in the current room's queue
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onQueueUpdate(cb) {
    Dubtrack.Events.on("realtime:room_playlist-queue-update", cb);
  }

  /**
   * Unsubscribe to changes in the current room's queue
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offQueueUpdate(cb) {
    Dubtrack.Events.off("realtime:room_playlist-queue-update", cb);
  }

  /**
   * Subscribe to when a user up/down votes (aka dub) a song
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onSongVote(cb) {
    Dubtrack.Events.on("realtime:room_playlist-dub", cb);
  }

  /**
   * Unbsubscribe to song vote event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offSongVote(cb) {
    Dubtrack.Events.off("realtime:room_playlist-dub", cb);
  }

  /**
   * Subscribe when a new chat message comes in
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onChatMessage(cb) {
    Dubtrack.Events.on("realtime:chat-message", cb);
  }

  /**
   * Unsubscribe to new chat messages event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offChatMessage(cb) {
    Dubtrack.Events.off("realtime:chat-message", cb);
  }

  /**
   * subscribe to when any user in the room grabs a song
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onSongGrab(cb) {
    Dubtrack.Events.on("realtime:room_playlist-queue-update-grabs", cb);
  }

  /**
   * Unsubscribe to when any user in the room grabs a song
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offSongGrab(cb) {
    Dubtrack.Events.off("realtime:room_playlist-queue-update-grabs", cb);
  }

  /**
   * Subscribe to user leave event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onUserLeave(cb) {
    Dubtrack.Events.on("realtime:user-leave", cb);
  }

  /**
   * Unsubscribe to user leave event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offUserLeave(cb) {
    Dubtrack.Events.off("realtime:user-leave", cb);
  }

  /**
   * Subscribe to new private message
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onNewPM(cb) {
    Dubtrack.Events.on("realtime:new-message", cb);
  }

  /**
   * Unsubscribe to new private message
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offNewPM(cb) {
    Dubtrack.Events.off("realtime:new-message", cb);
  }

  /******************************************************************
   * DOM Elements
   */

  /**
   * Returns the chat input element
   *
   * @readonly
   * @memberof DTProxy
   */
  get chatInput() {
    return document.getElementById("chat-txt-message");
  }

  /**
   * returns the <ul> containing all the chat messages
   *
   * @returns {HTMLUListElement}
   * @memberof DTProxy
   */
  chatList() {
    return document.querySelector("ul.chat-main");
  }

  /**
   * Returns all of the elements that hold the chat text
   *
   * @returns {NodeList}
   * @memberof DTProxy
   */
  allChatTexts() {
    return document.querySelectorAll(".chat-main .text");
  }

  /**
   * returns the little input that's in the grabs popup
   *
   * @returns {HTMLInputElement}
   * @memberof DTProxy
   */
  playlistInput() {
    return document.getElementById("playlist-input");
  }

  /**
   * returns the <li> in the grab popup
   *
   * @returns {NodeList}
   * @memberof DTProxy
   */
  grabPlaylists() {
    return document.querySelectorAll(".playlist-list-action li");
  }

  /**
   * Get the current minutes remaining of the song playing
   *
   * @returns {number}
   * @memberof DTProxy
   */
  getRemainingTime() {
    return parseInt(
      document.querySelector("#player-controller .currentTime span.min")
        .textContent
    );
  }

  /**
   * get the queue position
   * @returns {string}
   * @memberof DTProxy
   */
  getQueuePosition() {
    return parseInt(this.getQueuePositionElem().textContent);
  }

  /**
   * get element that contains the queue position
   * @returns {HTMLElement}
   * @memberof DTProxy
   */
  getQueuePositionElem() {
    return document.querySelector(".queue-position");
  }

  /**
   * Get the html element of a specific private message
   * @param {string} messageid
   * @returns {HTMLElement}
   * @memberof DTProxy
   */
  getPMmsg(messageid) {
    return document.querySelector(
      `.message-item[data-messageid="${messageid}"]`
    );
  }

  /**
   * the anchor element for the up dub button
   * @readonly
   * @memberof DTProxy
   */
  get upVote() {
    return document.querySelector(".dubup");
  }

  /**
   * get the anchor element for the down dub button
   * @readonly
   * @memberof DTProxy
   */
  get downVote() {
    return document.querySelector(".dubdown");
  }

  /**
   * get the add to playlist "grab" button
   * @readonly
   * @memberof DTProxy
   */
  get grabBtn() {
    return document.querySelector(".add-to-playlist-button");
  }

  /**
   * Returns the element that triggers the opening the private messages sidebar
   *
   * @readonly
   * @memberof DTProxy
   */
  get userPMs() {
    return document.querySelector(".user-messages");
  }

  /**
   * returns the full size background img element
   *
   * @readonly
   * @memberof DTProxy
   */
  get bgImg() {
    return document.querySelector(".backstretch-item img");
  }

  /**
   * returns the element used to hide/show the video
   *
   * @returns {HTMLDivElement}
   * @memberof DTProxy
   */
  hideVideoBtn() {
    return document.querySelector(".hideVideo-el");
  }

  /**
   * Returns the chat input's containing element
   *
   * @returns {HTMLDivElement}
   * @memberof DTProxy
   */
  getChatInputContainer() {
    return document.querySelector(".pusher-chat-widget-input");
  }

  /**
   * Get the track info of a SoundCloud track
   *
   * @param {string} scID - the soundcloud Id (known as fkid in Dubtrack)
   * @param {function} cb
   * @memberof DTProxy
   */
  getSCtrackInfo(scID, cb) {
    let url = `https://api.soundcloud.com/tracks/${scID}?client_id=${
      Dubtrack.config.keys.soundcloud
    }`;

    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        cb(null, json);
      })
      .catch(err => {
        cb(err);
      });
  }

  /*
    some more DOM elements being access but only has render targets for Preact
    going to leave them out for now

    document.querySelector('.player_sharing')
    document.querySelector(".chat-text-box-icons")
    document.querySelector(".header-right-navigation")
    document.querySelector("#room-main-player-container");
   */
}

const proxy = new DTProxy();

export default proxy;

import WaitFor from "@/utils/waitFor.js";

/**
 * In order to prepare for the future alpha changes and the possibility that
 * Dubtrack might alter this object of data we rely on, I am planning to funnel
 * all interaction with Dubtrack through this "proxy" (for lack of better word)
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
   * @memberof DTProxy
   */
  get apiUrl() {
    return Dubtrack.config.apiUrl;
  }

  /**
   * get the API url to get info about songs in the active queue
   *
   * @readonly
   * @memberof DTProxy
   */
  get roomQueueDetails() {
    const id = this.getRoomId;
    return this.apiUrl + Dubtrack.config.urls.roomQueueDetails.replace(':id', id);
  }

  /**
   * API url to get song info
   *
   * @readonly
   * @memberof DTProxy
   */
  get songAPI() {
    return this.apiUrl + Dubtrack.config.urls.song;
  }

  /**
   * returns the API URL for the active dubs in the current user is in
   *
   * @readonly
   * @memberof DTProxy
   */

  get activeDubsAPI() {
    return `${this.apiUrl}/${this.getRoomId}/playlist/active/dubs`;
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
   * Session Id is the same as User ID apparently
   *
   * @readonly
   * @memberof DTProxy
   */
  get getSessionId() {
    return Dubtrack.session.id;
  }

  /**
   * pass through of session id which is the same as user id
   *
   * @readonly
   * @memberof DTProxy
   */
  get getUserId() {
    return this.getSessionId;
  }

  /**
   * get the current logged in user name
   *
   * @readonly
   * @memberof DTProxy
   */
  get getUserName() {
    return Dubtrack.session.get("username");
  }

  /**
   * get current room's name. Don't let the name fool you, it doesn't return a
   * URL, it just returns the name of the room and that's it
   *
   * @readonly
   * @memberof DTProxy
   */
  get getRoomUrl() {
    return Dubtrack.room.model.get("roomUrl");
  }

  /**
   * returns the current room's id
   *
   * @readonly
   * @memberof DTProxy
   */
  get getRoomId() {
    return Dubtrack.room.model.id;
  }

  /**
   * set volume of room's player
   *
   * @param {number} vol - number between 0 - 100
   * @memberof DTProxy
   */
  setVolume(vol) {
    Dubtrack.room.player.setVolume(vol);
    Dubtrack.room.player.updateVolumeBar();
  }

  /**
   * get the current volume of the room's player
   *
   * @readonly
   * @memberof DTProxy
   */
  get getVolume() {
    return Dubtrack.playerController.volume;
  }

  /**
   * get the current mute state of the room's player
   *
   * @readonly
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
   * @memberof DTProxy
   */
  get getChatSoundUrl() {
    return Dubtrack.room.chat.mentionChatSound.url;
  }

  /**
   * set the mp3 file that is used for notifications
   *
   * @param {string} url - the url of the mp3 file
   * @memberof DTProxy
   */
  setChatSoundUrl(url) {
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
   *
   * @returns {boolean}
   * @memberof DTProxy
   */
  displayUserGrab() {
    return Dubtrack.room.model.get("displayUserGrab");
  }

  /**
   * get the name of the song that's currently playing in the room
   *
   * @readonly
   * @memberof DTProxy
   */
  get getSongName() {
    return Dubtrack.room.player.activeSong.get("songInfo").name;
  }

  /**
   * Get current playing song's platform ID (aka fkid)
   *
   * @readonly
   * @memberof DTProxy
   */
  get getSongFKID() {
    return Dubtrack.room.player.activeSong.get("songInfo").fkid;
  }

  /**
   * Get the Dubtrack ID for current song.
   *
   * @readonly
   * @memberof DTProxy
   */
  get getDubSong() {
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
   * returns whether user has "updub" or "downdub" current song
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
    this._handleAsync(this.roomQueueDetails,cb);
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
    Dubtrack.Events.bind("realtime:room_playlist-update", cb);
  }

  /**
   * unsubscribe to playlist updates
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offPlaylistUpdate(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-update", cb);
  }

  /**
   * Subscribe to changes in the current room's queue
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onPlaylistQueueUpdate(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-queue-update", cb);
  }

  /**
   * Unsubscribe to changes in the current room's queue
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offPlaylistQueueUpdate(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-queue-update", cb);
  }

  /**
   * Subscribe to when a user up/down votes (aka dub) a song
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onSongVote(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-dub", cb);
  }

  /**
   * Unbsubscribe to song vote event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offSongVote(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-dub", cb);
  }

  /**
   * Subscribe when a new chat message comes in
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onChatMessage(cb) {
    Dubtrack.Events.bind("realtime:chat-message", cb);
  }

  /**
   * Unsubscribe to new chat messages event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offChatMessage(cb) {
    Dubtrack.Events.unbind("realtime:chat-message", cb);
  }

  /**
   * subscribe to when any user in the room grabs a song
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onSongGrab(cb) {
    Dubtrack.Events.bind("realtime:room_playlist-queue-update-grabs", cb);
  }

  /**
   * Unsubscribe to when any user in the room grabs a song
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offSongGrab(cb) {
    Dubtrack.Events.unbind("realtime:room_playlist-queue-update-grabs", cb);
  }

  /**
   * Subscribe to user leave event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onUserLeave(cb) {
    Dubtrack.Events.bind("realtime:user-leave", cb);
  }

  /**
   * Unsubscribe to user leave event
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offUserLeave(cb) {
    Dubtrack.Events.unbind("realtime:user-leave", cb);
  }

  /**
   * Subscribe to new private message
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  onNewPM(cb) {
    Dubtrack.Events.bind("realtime:new-message", cb);
  }

  /**
   * Unsubscribe to new private message
   *
   * @param {function} cb
   * @memberof DTProxy
   */
  offNewPM(cb) {
    Dubtrack.Events.unbind("realtime:new-message", cb);
  }

  /******************************************************************
   * DOM Elements
   */

  /**
   * Returns the chat input element
   *
   * @returns {HTMLInputElement}
   * @memberof DTProxy
   */
  chatInput() {
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
   */
  getQueuePosition() {
    return parseInt(this.getQueuePositionElem().textContent);
  }

  /**
   * get element that contains the queue position
   * @returns {HTMLElement}
   */
  getQueuePositionElem() {
    return document.querySelector(".queue-position");
  }

  /**
   * Get the html element of a specific private message
   * @param {string} messageid
   * @returns {HTMLElement}
   */
  getPMmsg(messageid) {
    return document.querySelector(
      `.message-item[data-messageid="${messageid}"]`
    );
  }

  /**
   * get the anchor element for the up dub button
   * @returns {HTMLAnchorElement}
   */
  upVote() {
    return document.querySelector(".dubup");
  }

  /**
   * get the anchor element for the down dub button
   * @returns {HTMLAnchorElement}
   */
  downVote() {
    return document.querySelector(".dubdown");
  }

  /**
   * get the add to playlist "grab" button
   * @returns {HTMLAnchorElement}
   */
  grabBtn() {
    return document.querySelector(".add-to-playlist-button");
  }

  /**
   * Returns the element that triggers the opening the private messages sidebar
   *
   * @returns {HTMLDivElement}
   * @memberof DTProxy
   */
  userPMs() {
    return document.querySelector(".user-messages");
  }

  /**
   * returns the full size background img element
   *
   * @returns {HTMLImageElement}
   * @memberof DTProxy
   */
  bgImg() {
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
    let url = `https://api.soundcloud.com/tracks/${scID}?client_id=${Dubtrack.config.keys.soundcloud}`;
    
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        cb(null, json)
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

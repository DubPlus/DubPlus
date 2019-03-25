/******************************************************************
 * DOM Elements
 */
const DTProxyDOM = {
  /**
   * Returns the chat input element
   *
   * @property {HTMLElement}
   * @readonly
   */
  get chatInput() {
    return document.getElementById("chat-txt-message");
  },

  /**
   * get the <ul> containing all the chat messages
   *
   * @property {HTMLUListElement}
   * @readonly
   */
  get chatList() {
    return document.querySelector("ul.chat-main");
  },

  /**
   * Returns all of the elements that hold the chat text
   * this will remain a function because it changes often
   *
   * @returns {NodeList}
   */
  allChatTexts() {
    return document.querySelectorAll(".chat-main .text");
  },

  /**
   * returns the little input that's in the grabs popup
   * this gets created/destroyed often so should remain a function
   *
   * @returns {HTMLInputElement}
   */
  playlistInput() {
    return document.getElementById("playlist-input");
  },

  /**
   * returns the <li> in the grab popup
   * this gets created/destroyed often so should remain a function
   *
   * @returns {NodeList}
   */
  grabPlaylists() {
    return document.querySelectorAll(".playlist-list-action li");
  },

  getCurrentSongElem() {
    return document.querySelector(".currentSong");
  },

  /**
   * Get the current minutes remaining of the song playing
   *
   * @returns {number}
   */
  getRemainingTime() {
    return parseInt(
      document.querySelector("#player-controller .currentTime span.min")
        .textContent
    );
  },

  /**
   * get the queue position
   *
   * @returns {string}
   */
  getQueuePosition() {
    return parseInt(document.querySelector(".queue-position").textContent);
  },

  /**
   * Get the html element of a specific private message
   *
   * @param {string} messageid
   * @returns {HTMLElement}
   */
  getPMmsg(messageid) {
    return document.querySelector(
      `.message-item[data-messageid="${messageid}"]`
    );
  },

  /**
   * the anchor element for the up dub button
   * @readonly
   */
  get upVote() {
    return document.querySelector(".dubup");
  },

  /**
   * get the anchor element for the down dub button
   *
   * @readonly
   */
  get downVote() {
    return document.querySelector(".dubdown");
  },

  /**
   * get the add to playlist "grab" button, the one with the heart icon
   * @readonly
   */
  get grabBtn() {
    return document.querySelector(".add-to-playlist-button");
  },

  /**
   * Returns the element that triggers the opening the private messages sidebar
   *
   * @readonly
   */
  get userPMs() {
    return document.querySelector(".user-messages");
  },

  /**
   * returns the full size background img element
   *
   * @readonly
   */
  get bgImg() {
    return document.querySelector(".backstretch-item img");
  },

  /**
   * returns the element used to hide/show the video
   *
   * @property {HTMLElement}
   * @readonly
   */
  get hideVideoBtn() {
    return document.querySelector(".hideVideo-el");
  },

  /**
   * Returns the chat input's containing element
   *
   * @property {HTMLElement}
   * @readonly
   */
  get chatInputContainer() {
    return document.querySelector(".pusher-chat-widget-input");
  }
};

export default DTProxyDOM;

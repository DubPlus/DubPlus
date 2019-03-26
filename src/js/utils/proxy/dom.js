/******************************************************************
 * DOM Elements
 */
const DTProxyDOM = {
  /**
   * Returns the chat input element
   *
   * @returns {HTMLElement}
   */
  chatInput() {
    return document.getElementById("chat-txt-message");
  },

  /**
   * get the <ul> containing all the chat messages
   *
   * @returns {HTMLUListElement}
   */
  chatList() {
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

  /**
   * get the element that holds the text of the currently playing track in
   * the bottom player bar
   *
   * @returns {HTMLElement} think it's a span but that doesn't matter
   */
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
   * 
   * @returns {HTMLAnchorElement}
   */
  upVote() {
    return document.querySelector(".dubup");
  },

  /**
   * get the anchor element for the down dub button
   * 
   * @returns {HTMLAnchorElement}
   */
  downVote() {
    return document.querySelector(".dubdown");
  },

  /**
   * get the add to playlist "grab" button, the one with the heart icon
   * 
   * @returns {HTMLElement}
   */
  grabBtn() {
    return document.querySelector(".add-to-playlist-button");
  },

  /**
   * Returns the element that triggers the opening the private messages sidebar
   *
   * @returns {HTMLElement}
   */
  userPMs() {
    return document.querySelector(".user-messages");
  },

  /**
   * returns the full size background img element
   * 
   * @returns {HTMLImageElement}
   */
  bgImg() {
    return document.querySelector(".backstretch-item img");
  },

  /**
   * returns the element used to hide/show the video
   *
   * @returns {HTMLElement}
   */
  hideVideoBtn() {
    return document.querySelector(".hideVideo-el");
  },

  /**
   * Returns the chat input's containing element
   *
   * @returns {HTMLElement}
   */
  chatInputContainer() {
    return document.querySelector(".pusher-chat-widget-input");
  }
};

export default DTProxyDOM;

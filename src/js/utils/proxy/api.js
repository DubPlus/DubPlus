import dtGlobal from "./global_object";

/******************************************************************
 * API urls and calls
 */
const DTProxyAPIs = {
  /**
   * makes fetch call and handles the first response
   *
   * @private
   */
  _fetch(url) {
    return fetch(url).then(resp => resp.json());
  },

  /**
   * Make api call to get data for all the songs in the room's active queue
   *
   * @returns {Promise} returns a fetch promise which already resolves response.json()
   */
  getRoomQueue() {
    const api =
      Dubtrack.config.apiUrl +
      Dubtrack.config.urls.roomQueueDetails.replace(":id", dtGlobal.roomId());
    return this._fetch(api);
  },

  /**
   * make api call to get data for a specific song
   *
   * @param {string} songID
   * @returns {Promise} returns a fetch promise which already resolves response.json()
   */
  getSongData(songID) {
    const api = Dubtrack.config.apiUrl + Dubtrack.config.urls.song;
    return this._fetch(`${api}/${songID}`);
  },

  /**
   * Makes API call to get the dubs for the currently playing song in a room
   *
   * @returns {Promise} returns a fetch promise which already resolves response.json()
   */
  getActiveDubs() {
    // `https://api.dubtrack.fm/room/${this.getRoomId()}/playlist/active/dubs`;
    const apiBase = Dubtrack.config.apiUrl;
    let path = Dubtrack.config.urls.dubsPlaylistActive
      .replace(":id", dtGlobal.roomId())
      .replace(":playlistid", "active");
    return this._fetch(apiBase + path);
  },

  /**
   * returns the API url to get a users info
   *
   * @param {string} userid - current logged in user id
   * @returns {Promise} returns a fetch promise which already resolves response.json()
   */
  getUserData(userid) {
    const api =
      Dubtrack.config.apiUrl + Dubtrack.config.urls.user + "/" + userid;
    return this._fetch(api);
  },

  /**
   * fetch data from api about the current room user is in
   *
   * @returns {Promise} returns a fetch promise which already resolves response.json()
   */
  roomInfo() {
    const api = Dubtrack.config.apiUrl + "/room/" + dtGlobal.roomUrlName();
    return this._fetch(api);
  },

  /**
   * Form the url string for the avatar of a user
   *
   * @param {string} userid
   * @returns {string}
   */
  userImage(userid) {
    return `${Dubtrack.config.apiUrl}/user/${userid}/image`;
  },

  /**
   * Get the track info of a SoundCloud track
   *
   * @param {string} scID - the soundcloud Id (known as fkid in Dubtrack)
   * @returns {Promise} returns a fetch promise which already resolves response.json()
   */
  getSCtrackInfo(scID) {
    let url = `https://api.soundcloud.com/tracks/${scID}?client_id=${
      Dubtrack.config.keys.soundcloud
    }`;
    return fetch(url).then(resp => resp.json());
  }
};

export default DTProxyAPIs;

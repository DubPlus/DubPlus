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
   * Get Dubtrack's API url
   * even though this is part of the global object I'm leaving it here
   * since this is the only place using it
   *
   * @readonly
   * @property {string}
   */
  get apiUrl() {
    return Dubtrack.config.apiUrl;
  },

  /**
   * Make api call to get data for all the songs in the room's active queue
   *
   * @returns {Promise}
   */
  getRoomQueue() {
    const api =
      this.apiUrl +
      Dubtrack.config.urls.roomQueueDetails.replace(":id", dtGlobal.roomId);
    return this._fetch(api);
  },

  /**
   * make api call to get data for a specific song
   *
   * @param {string} songID
   * @returns {Promise}
   */
  getSongData(songID) {
    return this._fetch(`${this.songAPI}/${songID}`);
  },

  /**
   * API url to get song info
   *
   * @readonly
   * @property {string}
   */
  get songAPI() {
    return this.apiUrl + Dubtrack.config.urls.song;
  },

  /**
   * Makes API call to get the dubs for the currently playing song in a room
   *
   * @returns {Promise}
   */
  getActiveDubs() {
    const url = `${this.apiUrl}/${dtGlobal.roomId}/playlist/active/dubs`;
    return this._fetch(url);
  },

  /**
   * returns the API url to get a users info
   *
   * @param {string} userid - current logged in user id
   * @returns {Promise}
   */
  getUserData(userid) {
    const api = this.apiUrl + Dubtrack.config.urls.user + "/" + userid;
    return this._fetch(api);
  },

  /**
   * fetch data from api about the current room user is in
   *
   * @returns {Promise}
   */
  roomInfo() {
    return this._fetch(this.apiUrl + "/room/" + dtGlobal.roomUrlName);
  },

  /**
   * Form the url string for the avatar of a user
   *
   * @param {string} userid
   * @returns {string}
   */
  userImage(userid) {
    return `${this.apiUrl}/user/${userid}/image`;
  },

  /**
   * Get the track info of a SoundCloud track
   *
   * @param {string} scID - the soundcloud Id (known as fkid in Dubtrack)
   * @returns {Promise} returns a fetch promise
   */
  getSCtrackInfo(scID) {
    let url = `https://api.soundcloud.com/tracks/${scID}?client_id=${
      Dubtrack.config.keys.soundcloud
    }`;
    return fetch(url);
  }
};

export default DTProxyAPIs;

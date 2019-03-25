const DTProxyEvents = {
  /**
   * Subscribe to the room's current song changes including when a new song comes on
   *
   * @param {function} cb callback function to bind to playlist-update
   */
  onPlaylistUpdate(cb) {
    Dubtrack.Events.on("realtime:room_playlist-update", cb);
  },

  /**
   * unsubscribe to playlist updates
   *
   * @param {function} cb
   */
  offPlaylistUpdate(cb) {
    Dubtrack.Events.off("realtime:room_playlist-update", cb);
  },

  /**
   * Subscribe to changes in the current room's queue
   *
   * @param {function} cb
   */
  onQueueUpdate(cb) {
    Dubtrack.Events.on("realtime:room_playlist-queue-update", cb);
  },

  /**
   * Unsubscribe to changes in the current room's queue
   *
   * @param {function} cb
   */
  offQueueUpdate(cb) {
    Dubtrack.Events.off("realtime:room_playlist-queue-update", cb);
  },

  /**
   * Subscribe to when a user up/down votes (aka dub) a song
   *
   * @param {function} cb
   */
  onSongVote(cb) {
    Dubtrack.Events.on("realtime:room_playlist-dub", cb);
  },

  /**
   * Unbsubscribe to song vote event
   *
   * @param {function} cb
   */
  offSongVote(cb) {
    Dubtrack.Events.off("realtime:room_playlist-dub", cb);
  },

  /**
   * Subscribe when a new chat message comes in
   *
   * @param {function} cb
   */
  onChatMessage(cb) {
    Dubtrack.Events.on("realtime:chat-message", cb);
  },

  /**
   * Unsubscribe to new chat messages event
   *
   * @param {function} cb
   */
  offChatMessage(cb) {
    Dubtrack.Events.off("realtime:chat-message", cb);
  },

  /**
   * subscribe to when any user in the room grabs a song
   *
   * @param {function} cb
   */
  onSongGrab(cb) {
    Dubtrack.Events.on("realtime:room_playlist-queue-update-grabs", cb);
  },

  /**
   * Unsubscribe to when any user in the room grabs a song
   *
   * @param {function} cb
   */
  offSongGrab(cb) {
    Dubtrack.Events.off("realtime:room_playlist-queue-update-grabs", cb);
  },

  /**
   * Subscribe to user leave event
   *
   * @param {function} cb
   */
  onUserLeave(cb) {
    Dubtrack.Events.on("realtime:user-leave", cb);
  },

  /**
   * Unsubscribe to user leave event
   *
   * @param {function} cb
   */
  offUserLeave(cb) {
    Dubtrack.Events.off("realtime:user-leave", cb);
  },

  /**
   * Subscribe to new private message
   *
   * @param {function} cb
   */
  onNewPM(cb) {
    Dubtrack.Events.on("realtime:new-message", cb);
  },

  /**
   * Unsubscribe to new private message
   *
   * @param {function} cb
   */
  offNewPM(cb) {
    Dubtrack.Events.off("realtime:new-message", cb);
  }
};

export default DTProxyEvents;

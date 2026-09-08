/**
 * Every QueUp event Dub+ listens to, split by which emitter it comes from.
 */

/**
 * QueUp's app-level lifecycle events, via `window.QueUp.on/off`.
 * @satisfies {Record<string, keyof import('./types/global').QueUpEventMap>}
 */
export const QUEUP_EVENT = {
  /** The logged in user changed */
  SESSION_CHANGED: 'session:changed',

  /** The user entered a room. */
  ROOM_JOINED: 'room:joined',

  /** The user left a room. */
  ROOM_LEFT: 'room:left',

  /**
   * The player advanced to the next song.
   *
   * Prefer this over `REALTIME_EVENT.PLAYLIST_UPDATE`, which also fires for
   * queue joins and reorders.
   */
  SONG_CHANGED: 'room:song-changed',

  /** Someone else took over the decks. */
  DJ_CHANGED: 'room:dj-changed',
};

/**
 * QueUp's realtime socket feed, via `window.QueUp.realtime.on/off`.
 */
export const REALTIME_EVENT = {
  /** When a user in the room up/down dubs a song. */
  DUB: 'realtime:room_playlist-dub',

  /** When a user in the room grabs a song. */
  GRAB: 'realtime:room_playlist-queue-update-grabs',

  /** When a user leaves the room. */
  USER_LEAVE: 'realtime:user-leave',

  /** When a user joins the room. */
  USER_JOIN: 'realtime:user-join',

  /**
   * When the room playlist updates. Many things can trigger this.
   * - the next track plays
   * - someone joins the queue
   * - someone leaves the queue
   * - someone changes the order of the queue
   * - someone changes their song in the queue
   */
  PLAYLIST_UPDATE: 'realtime:room_playlist-update',

  /** When any chat message arrives in the chat. */
  CHAT_MESSAGE: 'realtime:chat-message',

  /** When a chat message is deleted by a moderator. */
  DELETE_CHAT_MESSAGE: 'realtime:delete-chat-message',

  /** When user receives a private message. */
  NEW_PM_MESSAGE: 'realtime:new-message',
};

// console.log('Dub+: TESTING QueUp events:', Object.values(QUEUP_EVENT));
// console.log('Dub+: TESTING Realtime events:', Object.values(REALTIME_EVENT));
// Object.values(QUEUP_EVENT).forEach((event) => {
//   window.QueUp.on(event, (data) => {
//     console.log(`Dub+: TESTING QueUp event: ${event}`, data);
//   })
// })

// Object.values(REALTIME_EVENT).forEach((event) => {
//   window.QueUp.realtime.on(event, (data) => {
//     console.log(`Dub+: TESTING Realtime event: ${event}`, data);
//   });
// });

/**
 * When a user in the rom up/down dubs a song
 */
export const DUB = "realtime:room_playlist-dub";

/**
 * When user in the room grabs a song
 */
export const GRAB = "realtime:room_playlist-queue-update-grabs";

/**
 * When a user leaves the room
 */
export const USER_LEAVE = "realtime:user-leave";

/**
 * When the room playlist updates. Many things can trigger this.
 * - the next track plays
 * - someone joins the queue
 * - someone leaves the queue
 * - someone changes the order of the queue
 * - someone changes their song in the queue
 *
 * Each time it still only gives you information about currently playing song
 */
export const PLAYLIST_UPDATE = "realtime:room_playlist-update";

/**
 * When any chat message arrives in the chat
 */
export const CHAT_MESSAGE = "realtime:chat-message";

/**
 * When user receives a private message
 */
export const NEW_PM_MESSAGE = "realtime:new-message";

// uncomment and copy paste into the console to see event objects
// [
//   "realtime:room_playlist-dub",
//   "realtime:room_playlist-queue-update-grabs",
//   "realtime:user-leave",
//   "realtime:room_playlist-update",
//   "realtime:chat-message",
//   "realtime:new-message",
// ].forEach((eventName) => {
//   window.QueUp.Events.bind(eventName, (e) => {
//     console.debug("DUB+", eventName, e);
//   });
// });

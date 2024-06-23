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
 */
export const PLAYLIST_UPDATE = "realtime:room_playlist-update";

/**
 * When a new chat message arrives in the chat
 */
export const CHAT_MESSAGE = "realtime:chat-message";

/**
 * When user receives a private message
 */
export const NEW_PM_MESSAGE = "realtime:new-message";

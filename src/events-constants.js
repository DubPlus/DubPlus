/**
 * Event names for `queupEvents` (see ./utils/events.js).
 *
 * QueUp's RealtimeManager emits `realtime:` + the payload's `type`, and we
 * re-emit under that exact name, so these constants match QueUp's own naming.
 * Dub+'s own synthetic events use a `dubplus:` prefix instead.
 */

/**
 * When the song changes.
 * This one is a custom event from Dub+ and not a Queup event.
 * It is triggered by a MutationObserver on the song title element
 */
export const PLAYER_ADVANCE = 'dubplus:playerAdvance';

/**
 * When a user in the room up/down dubs a song
 */
export const DUB = 'realtime:room_playlist-dub';

/**
 * When user in the room grabs a song
 */
export const GRAB = 'realtime:room_playlist-queue-update-grabs';

/**
 * When a user leaves the room
 */
export const USER_LEAVE = 'realtime:user-leave';

/**
 * When a user joins the room
 */
export const USER_JOIN = 'realtime:user-join';

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
export const PLAYLIST_UPDATE = 'realtime:room_playlist-update';

/**
 * When any chat message arrives in the chat
 */
export const CHAT_MESSAGE = 'realtime:chat-message';

/**
 * When a chat message is deleted by a moderator
 */
export const DELETE_CHAT_MESSAGE = 'realtime:delete-chat-message';

/**
 * When user receives a private message
 */
export const NEW_PM_MESSAGE = 'realtime:new-message';

/**
 * The full set of event types QueUp validates against a schema, for reference.
 * Anything not listed here still gets emitted - QueUp only logs a validation
 * warning for unknown types - so this is not an exhaustive list of what can
 * arrive, just of what QueUp considers known.
 *
 * To watch everything live, paste this into the console:
 *
 *   const stop = window.dubplus.debugQueupRealtime();
 *
 * user-join, user-leave, user-setrole, user-unsetrole, user-kick, user-ban,
 * user-unban, user-mute, user-unmute, user_update, user-avatar-update,
 * user-pause-queue-mod, room-lock-queue, room-update, room-slow-mode,
 * room-allow-guest-chat, room-allow-guest-embed, chat-skip, chat-message,
 * delete-chat-message, new-message, room_playlist-update, room_playlist-dub,
 * room_playlist-queue-reorder, room_playlist-queue-update,
 * room_playlist-queue-update-dub, room_playlist-queue-update-grabs,
 * room_playlist-queue-remove-user, room_playlist-queue-remove-user-song
 */

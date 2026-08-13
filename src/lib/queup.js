/**
 * Anything that accesses window.QueUp (QueUp's internal app instance) should
 * go here so that when there's any future changes to QueUp's internals,
 * we'll just need to update this file.
 */

// ----- Session -----

/**
 * @returns {string}
 */
export function getSessionId() {
  return window.QueUp.session.id;
}

/**
 * @returns {string}
 */
export function getSessionUsername() {
  return window.QueUp.session.get('username');
}

// ----- Events -----

/**
 * @param {string} eventName
 * @param {(...args: any[]) => void} handler
 */
export function bindEvent(eventName, handler) {
  window.QueUp.Events.bind(eventName, handler);
}

/**
 * @param {string} eventName
 * @param {(...args: any[]) => void} handler
 */
export function unbindEvent(eventName, handler) {
  window.QueUp.Events.unbind(eventName, handler);
}

// ----- Chat -----

/**
 * @returns {boolean}
 */
export function isChatReady() {
  return Boolean(window.QueUp?.room?.chat);
}

export function resizeChatTextarea() {
  window.QueUp.room.chat.resizeTextarea();
}

export function submitChatMessage() {
  window.QueUp.room.chat.sendMessage();
}

/**
 * @param {KeyboardEvent} e
 */
export function chatNcKeyDown(e) {
  window.QueUp.room.chat.ncKeyDown(e);
}

const CHAT_KEYDOWN_EVENT = 'keydown #chat-txt-message';

/**
 * Removes QueUp's native keydown handler on the chat input so a custom one
 * can take over. Returns the original handler so it can be restored later
 * with {@link restoreChatKeydownHandler}.
 * @returns {Function | undefined}
 */
export function disableChatKeydownHandler() {
  const original = window.QueUp.room.chat.events[CHAT_KEYDOWN_EVENT];
  const newEventsObject = { ...window.QueUp.room.chat.events };
  delete newEventsObject[CHAT_KEYDOWN_EVENT];
  window.QueUp.room.chat.delegateEvents(newEventsObject);
  return original;
}

/**
 * @param {Function} handler
 */
export function restoreChatKeydownHandler(handler) {
  window.QueUp.room.chat.events[CHAT_KEYDOWN_EVENT] = handler;
  window.QueUp.room.chat.delegateEvents(window.QueUp.room.chat.events);
}

export function playMentionChatSound() {
  window.QueUp.room.chat.mentionChatSound.play();
}

/**
 * @returns {string}
 */
export function getMentionChatSoundUrl() {
  return window.QueUp.room.chat.mentionChatSound.url;
}

/**
 * @param {string} url
 */
export function setMentionChatSoundUrl(url) {
  window.QueUp.room.chat.mentionChatSound.url = url;
}

// ----- Player -----

export function clickVoteUp() {
  window.QueUp?.playerController?.voteUp?.click();
}

/**
 * @returns {number}
 */
export function getPlayerVolume() {
  return window.QueUp.playerController.volume;
}

export function mutePlayer() {
  window.QueUp.room.player.mutePlayer();
}

/**
 * @param {number} volume
 */
export function setPlayerVolume(volume) {
  window.QueUp.room.player.setVolume(volume);
}

export function updateVolumeBar() {
  window.QueUp.room.player.updateVolumeBar();
}

/**
 * @returns {boolean}
 */
export function isPlayerMuted() {
  return window.QueUp.room.player.muted_player;
}

/**
 * @returns {string}
 */
export function getActiveSongUserId() {
  return window.QueUp.room.player.activeSong.attributes.song.userid;
}

/**
 * @returns {string}
 */
export function getActiveSongName() {
  return window.QueUp.room.player.activeSong.attributes.songInfo.name;
}

/**
 * @returns {number}
 */
export function getActiveSongPlayedAt() {
  return window.QueUp.room.player.activeSong.attributes.song.played;
}

/**
 * @returns {number}
 */
export function getActiveSongUpdubs() {
  return window.QueUp.room.player.activeSong.attributes.song.updubs;
}

/**
 * @returns {number}
 */
export function getActiveSongDowndubs() {
  return window.QueUp.room.player.activeSong.attributes.song.downdubs;
}

// ----- Room -----

/**
 * @returns {string}
 */
export function getRoomUrl() {
  return window.QueUp.room.model.get('roomUrl');
}

/**
 * @returns {string}
 */
export function getRoomId() {
  return window.QueUp.room.model.id;
}

/**
 * @returns {boolean}
 */
export function getDisplayUserGrab() {
  return window.QueUp.room.model.get('displayUserGrab');
}

// ----- Users -----

/**
 * @param {string} userid
 * @returns {string | undefined}
 */
export function getUsernameById(userid) {
  return window.QueUp.room.users.collection.findWhere({ userid })?.attributes
    ?._user?.username;
}

/**
 * @param {string} userid
 * @returns {boolean}
 */
export function isSiteAdmin(userid) {
  return window.QueUp.helpers.isSiteAdmin(userid);
}

/**
 * @param {string} userid
 * @returns {boolean}
 */
export function isRoomOwner(userid) {
  return window.QueUp.room.users.getIfOwner(userid);
}

/**
 * @param {string} userid
 * @returns {boolean}
 */
export function isRoomManager(userid) {
  return window.QueUp.room.users.getIfManager(userid);
}

/**
 * @param {string} userid
 * @returns {boolean}
 */
export function isRoomMod(userid) {
  return window.QueUp.room.users.getIfMod(userid);
}

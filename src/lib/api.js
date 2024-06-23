/**
 * QueUp API wrappers
 */

/**
 * @param {string} userid
 */
export function userData(userid) {
  return `https://api.queup.net/user/${userid}`;
}

/**
 *
 * @param {string} roomId
 */
export function activeDubs(roomId) {
  return `https://api.queup.net/room/${roomId}/playlist/active/dubs`;
}

/**
 * @param {string} userid
 */
export function userImage(userid) {
  return `https://api.queup.net/user/${userid}/image`;
}

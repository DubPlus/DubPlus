/**
 * QueUp API wrappers
 */

export const apiBase = window.location.hostname.includes('staging')
  ? 'https://staging-api.queup.dev'
  : 'https://api.queup.net';

/**
 * @param {string} userid
 */
export function userData(userid) {
  return `${apiBase}/user/${userid}`;
}

/**
 *
 * @param {string} roomId
 */
export function activeDubs(roomId) {
  return `${apiBase}/room/${roomId}/playlist/active/dubs`;
}

/**
 * @param {string} userid
 */
export function userImage(userid) {
  return `${apiBase}/user/${userid}/image`;
}

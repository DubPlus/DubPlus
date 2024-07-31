/**
 * Check if a user is at least a mod or above
 * @param {string} userid
 */
export function isMod(userid) {
  return (
    window.QueUp.helpers.isSiteAdmin(userid) ||
    window.QueUp.room.users.getIfOwner(userid) ||
    window.QueUp.room.users.getIfManager(userid) ||
    window.QueUp.room.users.getIfMod(userid)
  );
}

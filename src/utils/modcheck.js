import {
  isSiteAdmin,
  isRoomOwner,
  isRoomManager,
  isRoomMod,
} from '../lib/queup';

/**
 * Check if a user is at least a mod or above
 * @param {string} userid
 */
export function isMod(userid) {
  return (
    isSiteAdmin(userid) ||
    isRoomOwner(userid) ||
    isRoomManager(userid) ||
    isRoomMod(userid)
  );
}

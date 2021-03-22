/**
 * Check if a user is at least a mod or above
 */
/*global Dubtrack */
export default function(userid){
  return QueUp.helpers.isSiteAdmin(userid) ||
    QueUp.room.users.getIfOwner(userid) ||
    QueUp.room.users.getIfManager(userid) ||
    QueUp.room.users.getIfMod(userid);
}
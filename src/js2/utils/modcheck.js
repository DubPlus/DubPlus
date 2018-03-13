/**
 * Check if a user is at least a mod or above
 */
/*global Dubtrack */
export default function(userid){
  return Dubtrack.helpers.isDubtrackAdmin(userid) ||
    Dubtrack.room.users.getIfOwner(userid) ||
    Dubtrack.room.users.getIfManager(userid) ||
    Dubtrack.room.users.getIfMod(userid);
}
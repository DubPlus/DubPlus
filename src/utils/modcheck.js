import { usersInRoom } from '../lib/api';
import { logError, logWarn } from './logger';
import { queupEvents, USER_JOIN } from '../utils/events.js';

/**
 * Check if a user is at least a mod or above
 * @param {string} userid
 */
export function isMod(userid) {
  const user = window.dubplus.roomUsers?.get(userid);
  if (!user) return false;
  // if user has the "skip" rights, they are considered a mod
  return user.role.rights.includes('skip');
}

/**
 * @param {string} roomId
 */
async function loadUserData(roomId) {
  try {
    const response = await fetch(usersInRoom(roomId));
    /**@type {import('../types/api-response').RoomUsersApiResponse} */
    const json = await response.json();
    return json.data;
  } catch (error) {
    logError('Failed to load user data for roomId: ' + roomId, error);
  }
}

/**
 *
 * @param {import('../types/api-response').RoomUser[] | undefined} roomUsers
 */
function processUserData(roomUsers = []) {
  // save a subset of the user data onto our window.dubplus
  window.dubplus = window.dubplus || {};
  window.dubplus.roomUsers = window.dubplus.roomUsers || new Map();

  roomUsers.forEach((user) => {
    const simplifiedUser = {
      userid: user.userid,
      username: user._user.username,
      role: {
        type: user.roleid?.type || '',
        label: user.roleid?.label || '',
        rights: user.roleid?.rights || [],
      },
    };
    window.dubplus.roomUsers?.set(user.userid, simplifiedUser);
  });
}

/**
 *
 * @param {import('../types/events').UserJoinEvent} e
 */
function onUserJoin(e) {
  if (window.dubplus.roomUsers) {
    window.dubplus.roomUsers.set(e.user.userInfo.userid, {
      userid: e.user.userInfo.userid,
      username: e.user.username,
      role: {
        type: e.roomUser.roleid?.type || '',
        label: e.roomUser.roleid?.label || '',
        rights: e.roomUser.roleid?.rights || [],
      },
    });
  } else {
    logWarn('User joined but roomUsers map is not initialized');
  }
}

/**
 *
 * @param {string} roomId
 */
export async function setupModCheck(roomId) {
  await loadUserData(roomId).then(processUserData);
  queupEvents.on(USER_JOIN, onUserJoin);
}

/**
 * do this when unmounting or changing rooms
 */
export async function teardownModCheck() {
  queupEvents.off(USER_JOIN, onUserJoin);
  window.dubplus.roomUsers?.clear();
}

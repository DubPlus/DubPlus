/**
 * Show Dubs on hover module
 * @module showDubsOnHover
 *
 * The way this works is that we listen for events from the queup API for upDubs, downDubs, and grabs.
 * When we get an event, we update our local state with the new information.
 * We also listen for when the song changes, and reset our state when that happens.
 *
 * The actual display of the dubs is handled by a Svelte component called {@link DubsInfo},
 * which is mounted when the user hovers over the upDub, downDub, or grab buttons.
 */
import { logError } from '../../utils/logger.js';
import { dubsState, getDubCount } from '../stores/dubsState.svelte.js';
import { QUEUP_EVENT, REALTIME_EVENT } from '../../events-constants.js';
import { activeDubs, userData } from '../api.js';
import { delegateHoverMount } from '../../utils/delegateHoverMount.js';
import { getDubUp, getDubDown, getAddToPlaylist } from '../queup.ui.js';
import {
  getRoomId,
  onQueup,
  offQueup,
  onRealtime,
  offRealtime,
} from '../queup.v2.js';
import DubsInfo from '../satellites/DubsInfo.svelte';

/**
 * @param {string} userid
 * @returns {Promise<string>}
 */
function getUserNameFromId(userid) {
  return fetch(userData(userid))
    .then((response) => response.json())
    .then((response) => {
      if (!response?.data?.username) {
        throw new Error(
          'Failed to get username from API for userid: ' + userid,
        );
      }
      return response.data.username;
    });
}

/**
 * Pushes {userid, username} onto the given dub type's list, unless it's
 * already there. Safe to call from racing async callbacks since the
 * presence check and the push happen without an intervening await.
 * @param {import("../stores/dubsState.svelte.js").DubType} dubType
 * @param {string} userid
 * @param {string} username
 */
function addDubIfAbsent(dubType, userid, username) {
  const list = getDubCount(dubType);
  if (list.find((el) => el.userid === userid)) {
    return;
  }
  list.push({ userid, username });
}

/**
 * Resolves usernames for a batch of dubs (from the initial API fetch) and
 * adds each one to state.
 * @param {import("../stores/dubsState.svelte.js").DubType} dubType
 * @param {Array<{ userid: string }>} [dubs]
 */
function updateDubs(dubType, dubs) {
  dubs?.forEach(({ userid }) => {
    // even though we reset before calling this, because this is async we could have
    // had a dub added (e.g. via a realtime event) in the time it took to fetch the data
    if (getDubCount(dubType).find((el) => el.userid === userid)) {
      return;
    }

    getUserNameFromId(userid)
      .then((username) => addDubIfAbsent(dubType, userid, username))
      .catch((error) =>
        logError(`Failed to get username for ${dubType}s:`, error),
      );
  });
}

function resetDubs() {
  dubsState.downDubs = [];
  dubsState.upDubs = [];
  dubsState.grabs = [];

  // hit the API to get the current dubs
  const roomId = getRoomId();
  if (roomId) {
    const dubsURL = activeDubs(roomId);
    fetch(dubsURL)
      .then((response) => response.json())
      .then((response) => {
        updateDubs('updub', response.data.upDubs);
        updateDubs('grab', response.data.grabs);
        updateDubs('downdub', response.data.downDubs);
      })
      .catch((error) => logError('Failed to fetch dubs data from API.', error));
  }
}

/**
 * @param {import("../../types/events.js").DubEvent} e
 */
function dubWatcher(e) {
  if (e.dubtype === 'updub') {
    addDubIfAbsent('updub', e.user._id, e.user.username);
    // Remove user from the other dub type if it exists there
    dubsState.downDubs = dubsState.downDubs.filter(
      (el) => el.userid !== e.user._id,
    );
  } else if (e.dubtype === 'downdub') {
    addDubIfAbsent('downdub', e.user._id, e.user.username);
    // Remove user from the other dub type if it exists there
    dubsState.upDubs = dubsState.upDubs.filter(
      (el) => el.userid !== e.user._id,
    );
  }
}

/**
 * @param {import("../../types/events.js").GrabEvent} e
 */
function grabWatcher(e) {
  addDubIfAbsent('grab', e.user._id, e.user.username);
}

/**
 * @param {import("../stores/dubsState.svelte.js").DubType} dubType
 * @param {Element} target
 * @returns {{
 *   dubType: import("../stores/dubsState.svelte.js").DubType,
 *   position: { top: number, left: number, right: number },
 * }}
 */
function buildHoverProps(dubType, target) {
  const rect = target.getBoundingClientRect();
  return {
    dubType,
    position: {
      top: rect.top,
      left: rect.left,
      right: window.innerWidth - rect.right,
    },
  };
}

/**
 * @type {ReturnType<typeof delegateHoverMount> | null}
 */
let updubHoverTeardown = null;
/**
 * @type {ReturnType<typeof delegateHoverMount> | null}
 */
let downdubHoverTeardown = null;
/**
 * @type {ReturnType<typeof delegateHoverMount> | null}
 */
let grabHoverTeardown = null;

/**
 * @type {import("./module.js").DubPlusModule}
 */
export const showDubsOnHover = {
  id: 'dubs-hover',
  label: 'dubs-hover.label',
  description: 'dubs-hover.description',
  category: 'general',
  turnOn() {
    resetDubs();
    onRealtime(REALTIME_EVENT.DUB, dubWatcher);
    onRealtime(REALTIME_EVENT.GRAB, grabWatcher);
    onQueup(QUEUP_EVENT.SONG_CHANGED, resetDubs);

    // setup hover listener
    updubHoverTeardown = delegateHoverMount(getDubUp, DubsInfo, (target) =>
      buildHoverProps('updub', target),
    );
    downdubHoverTeardown = delegateHoverMount(getDubDown, DubsInfo, (target) =>
      buildHoverProps('downdub', target),
    );
    grabHoverTeardown = delegateHoverMount(
      getAddToPlaylist,
      DubsInfo,
      (target) => buildHoverProps('grab', target),
    );
  },

  turnOff() {
    offRealtime(REALTIME_EVENT.DUB, dubWatcher);
    offRealtime(REALTIME_EVENT.GRAB, grabWatcher);
    offQueup(QUEUP_EVENT.SONG_CHANGED, resetDubs);
    if (typeof updubHoverTeardown === 'function') {
      updubHoverTeardown();
      updubHoverTeardown = null;
    }
    if (typeof downdubHoverTeardown === 'function') {
      downdubHoverTeardown();
      downdubHoverTeardown = null;
    }
    if (typeof grabHoverTeardown === 'function') {
      grabHoverTeardown();
      grabHoverTeardown = null;
    }
  },
};

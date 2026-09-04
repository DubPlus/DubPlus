import { logError } from '../../utils/logger.js';
import { dubsState } from '../stores/dubsState.svelte.js';
import { queupEvents, DUB, GRAB, PLAYER_ADVANCE } from '../../utils/events.js';
import { activeDubs, userData } from '../api.js';
import { delegateHoverMount } from '../../utils/delegateHoverMount.js';
import DubsInfo from '../satellites/DubsInfo.svelte';

/**
 * @param {string} userid
 * @returns {Promise<string>}
 */
function getUserNameFromId(userid) {
  return new Promise((resolve, reject) => {
    // or try getting it via the API
    fetch(userData(userid))
      .then((response) => response.json())
      .then((response) => {
        if (response?.data?.username) {
          const { username } = response.data;
          resolve(username);
        } else {
          reject('Failed to get username from API for userid: ' + userid);
        }
      })
      .catch(reject);
  });
}

/**
 * @param {Array<{ userid: string}>} updubs
 */
function updateUpdubs(updubs) {
  updubs?.forEach((dub) => {
    // even though we reset before calling this, because this is async we could have
    // had an upDub in the time it took to fetch the data
    if (dubsState.upDubs.find((el) => el.userid === dub.userid)) {
      return;
    }

    getUserNameFromId(dub.userid)
      .then((username) => {
        dubsState.upDubs.push({
          userid: dub.userid,
          username,
        });
      })
      .catch((error) => logError('Failed to get username for upDubs:', error));
  });
}

/**
 * @param {Array<{ userid: string}>} downdubs
 */
function updateDowndubs(downdubs) {
  downdubs?.forEach((dub) => {
    // even though we reset before calling this, because this is async we could have
    // had an upDub in the time it took to fetch the data
    if (dubsState.downDubs.find((el) => el.userid === dub.userid)) {
      return;
    }

    getUserNameFromId(dub.userid)
      .then((username) => {
        dubsState.downDubs.push({
          userid: dub.userid,
          username,
        });
      })
      .catch((error) => logError('Failed to get username for downDubs', error));
  });
}

/**
 * @param {Array<{ userid: string}>} grabs
 */
function updateGrabs(grabs) {
  grabs.forEach((grab) => {
    if (dubsState.grabs.find((el) => el.userid === grab.userid)) {
      return;
    }

    getUserNameFromId(grab.userid)
      .then((username) => {
        dubsState.grabs.push({
          userid: grab.userid,
          username,
        });
      })
      .catch((error) => logError('Failed to get username for grab', error));
  });
}

function resetDubs() {
  dubsState.downDubs = [];
  dubsState.upDubs = [];
  dubsState.grabs = [];

  // hit the API to get the current dubs
  if (window.dubplus.roomId) {
    const dubsURL = activeDubs(window.dubplus.roomId);
    fetch(dubsURL)
      .then((response) => response.json())
      .then((response) => {
        updateUpdubs(response.data.upDubs || []);
        updateGrabs(response.data.grabs || []);
        updateDowndubs(response.data.downDubs || []);
      })
      .catch((error) => logError('Failed to fetch dubs data from API.', error));
  }
}

/**
 * @param {import("../../types/events.js").DubEvent} e
 * @returns
 */
function dubWatcher(e) {
  if (e.dubtype === 'updub') {
    if (!dubsState.upDubs.find((el) => el.userid === e.user._id)) {
      dubsState.upDubs.push({
        userid: e.user._id,
        username: e.user.username,
      });
    }

    //Remove user from other dubtype if exists
    dubsState.downDubs = dubsState.downDubs.filter(
      (el) => el.userid !== e.user._id,
    );
  } else if (e.dubtype === 'downdub') {
    if (!dubsState.downDubs.find((el) => el.userid === e.user._id)) {
      dubsState.downDubs.push({
        userid: e.user._id,
        username: e.user.username,
      });
    }

    //Remove user from other dubtype if exists
    dubsState.upDubs = dubsState.upDubs.filter(
      (el) => el.userid !== e.user._id,
    );
  }
}

/**
 * @param {import("../../types/events.js").GrabEvent} e
 */
function grabWatcher(e) {
  if (!dubsState.grabs.find((el) => el.userid === e.user._id)) {
    dubsState.grabs.push({
      userid: e.user._id,
      username: e.user.username,
    });
  }
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
    queupEvents.on(DUB, dubWatcher);
    queupEvents.on(GRAB, grabWatcher);
    queupEvents.on(PLAYER_ADVANCE, resetDubs);

    // setup hover listener
    updubHoverTeardown = delegateHoverMount(
      'body > div > div > div > div:last-child > div:last-child button:has(> svg.lucide-chevron-up)',
      DubsInfo,
      (target) => {
        const rect = target.getBoundingClientRect();
        return {
          dubType: 'updub',
          position: {
            top: rect.top,
            left: rect.left,
            right: window.innerWidth - rect.right,
          },
        };
      },
    );
    downdubHoverTeardown = delegateHoverMount(
      'body > div > div > div > div:last-child > div:last-child button:has(> svg.lucide-chevron-down)',
      DubsInfo,
      (target) => {
        const rect = target.getBoundingClientRect();
        return {
          dubType: 'downdub',
          position: {
            top: rect.top,
            left: rect.left,
            right: window.innerWidth - rect.right,
          },
        };
      },
    );
    grabHoverTeardown = delegateHoverMount(
      'body > div > div > div > div:last-child > div:last-child button:has(> svg.lucide-heart)',
      DubsInfo,
      (target) => {
        const rect = target.getBoundingClientRect();
        return {
          dubType: 'grab',
          position: {
            top: rect.top,
            left: rect.left,
            right: window.innerWidth - rect.right,
          },
        };
      },
    );
  },

  turnOff() {
    queupEvents.off(DUB, dubWatcher);
    queupEvents.off(GRAB, grabWatcher);
    queupEvents.off(PLAYER_ADVANCE, resetDubs);
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

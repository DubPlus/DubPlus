import { logError } from '../../utils/logger.js';
import { isMod } from '../../utils/modcheck.js';
import { dubsState } from '../stores/dubsState.svelte.js';
import {
  DUB,
  GRAB,
  PLAYLIST_UPDATE,
  USER_LEAVE,
} from '../../events-constants.js';
import { activeDubs, userData } from '../api.js';

/**
 * @param {string} userid
 * @returns {Promise<string>}
 */
function getUserName(userid) {
  return new Promise((resolve, reject) => {
    // check if we already have the username
    const username = window.QueUp.room.users.collection.findWhere({
      userid,
    })?.attributes?._user?.username;

    if (username) {
      resolve(username);
      return;
    }

    // or try getting it via the API
    fetch(userData(userid))
      .then((response) => response.json())
      .then((response) => {
        if (response?.userinfo?.username) {
          const { username } = response.userinfo;
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
  updubs.forEach((dub) => {
    // even though we reset before calling this, because this is async we could have
    // had an upDub in the time it took to fetch the data
    if (dubsState.upDubs.find((el) => el.userid === dub.userid)) {
      return;
    }

    getUserName(dub.userid)
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
  downdubs.forEach((dub) => {
    // even though we reset before calling this, because this is async we could have
    // had an upDub in the time it took to fetch the data
    if (dubsState.downDubs.find((el) => el.userid === dub.userid)) {
      return;
    }

    getUserName(dub.userid)
      .then((username) => {
        dubsState.downDubs.push({
          userid: dub.userid,
          username,
        });
      })
      .catch((error) => logError('Failed to get username for downDubs', error));
  });
}

// /**
//  * @param {Array<{ userid: string}>} grabs
//  */
// function updateGrabs(grabs) {
//   grabs.forEach((grab) => {
//     if (dubsState.grabs.find((el) => el.userid === grab.userid)) {
//       return;
//     }

//     getUserName(grab.userid)
//       .then((username) => {
//         dubsState.grabs.push({
//           userid: grab.userid,
//           username,
//         });
//       })
//       .catch((error) => logError('Failed to get username for grab', error));
//   });
// }

function resetDubs() {
  dubsState.downDubs = [];
  dubsState.upDubs = [];
  dubsState.grabs = [];

  const dubsURL = activeDubs(window.QueUp.room.model.id);
  fetch(dubsURL)
    .then((response) => response.json())
    .then((response) => {
      updateUpdubs(response.data.upDubs);
      // updateGrabs(response.data.grabs);

      //Only let mods or higher access down dubs
      if (isMod(window.QueUp.session.id)) {
        updateDowndubs(response.data.downDubs);
      }
    })
    .catch((error) => logError('Failed to fetch dubs data from API.', error));
}

/**
 * @param {import("../../events.js").DubEvent} e
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
  } else if (e.dubtype === 'downdub' && isMod(window.QueUp.session.id)) {
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

  const msSinceSongStart =
    Date.now() - window.QueUp.room.player.activeSong.attributes.song.played;

  // not sure why we are checking this, maybe to give the API time to update?
  // if the song started less than 1 second ago, don't reset the dubs
  if (msSinceSongStart < 1000) {
    return;
  }

  // if the dubs don't match the API, reset them
  if (
    dubsState.upDubs.length !==
    window.QueUp.room.player.activeSong.attributes.song.updubs
  ) {
    resetDubs();
  } else if (
    isMod(window.QueUp.session.id) &&
    dubsState.downDubs.length !==
      window.QueUp.room.player.activeSong.attributes.song.downdubs
  ) {
    resetDubs();
  }
}

/**
 * @param {import("../../events.js").GrabEvent} e
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
 * @param {import("../../events.js").UserLeaveEvent} e
 */
function dubUserLeaveWatcher(e) {
  // remove from up dubs
  dubsState.upDubs = dubsState.upDubs.filter((el) => el.userid !== e.user._id);
  // remove from down dubs
  dubsState.downDubs = dubsState.downDubs.filter(
    (el) => el.userid !== e.user._id,
  );
  // remove from grabs
  dubsState.grabs = dubsState.grabs.filter((el) => el.userid !== e.user._id);
}

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
    window.QueUp.Events.bind(DUB, dubWatcher);
    window.QueUp.Events.bind(GRAB, grabWatcher);
    window.QueUp.Events.bind(USER_LEAVE, dubUserLeaveWatcher);
    window.QueUp.Events.bind(PLAYLIST_UPDATE, resetDubs);
  },

  turnOff() {
    window.QueUp.Events.unbind(DUB, dubWatcher);
    window.QueUp.Events.unbind(GRAB, grabWatcher);
    window.QueUp.Events.unbind(USER_LEAVE, dubUserLeaveWatcher);
    window.QueUp.Events.unbind(PLAYLIST_UPDATE, resetDubs);
  },
};

import { logInfo } from '../../utils/logger';

const MODULE_ID = 'keep-awake';

/**
 * @type {WakeLockSentinel|null}
 */
let wakeLock = null;

/**
 * @type {import("./module").DubPlusModule}
 */
export const keepAwake = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'general',
  turnOn() {
    navigator.wakeLock
      .request('screen')
      .then((sentinel) => {
        wakeLock = sentinel;
        logInfo('Wake Lock is active!');
      })
      .catch((err) => {
        window.alert(`Wake Lock request failed: ${err.name}, ${err.message}`);
      });
  },
  turnOff() {
    wakeLock?.release().then(() => {
      wakeLock = null;
      logInfo('Wake Lock has been released.');
    });
  },
};

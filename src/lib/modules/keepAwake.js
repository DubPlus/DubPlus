import { logInfo, logError } from '../../utils/logger';
import { saveSetting, settings } from '../stores/settings.svelte';

const MODULE_ID = 'keep-awake';

/**
 * @type {WakeLockSentinel|null}
 */
let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');

    // Listen for the lock being released by the system
    wakeLock.addEventListener(
      'release',
      () => {
        logInfo('Wake Lock was released');
        wakeLock = null;
        // hidden = browser released it on tab switch; handleVisibilityChange re-acquires
        if (document.visibilityState === 'visible') {
          saveSetting('options', MODULE_ID, false);
        }
      },
      { once: true },
    );
    logInfo('Wake Lock is active');
  } catch (err) {
    saveSetting('options', MODULE_ID, false); // denied (battery saver, hidden tab on load, etc.)
    if (err instanceof Error) {
      logError(`Error requesting wake lock: ${err.name}, ${err.message}`);
    } else {
      logError(`Error requesting wake lock: Unknown error: ${err}`);
    }
    alert(
      'Could not enable Dub+ Keep Awake. This could happen because your machine is in battery saver mode or the tab is hidden on load. See dev console for more details.',
    );
  }
}

async function handleVisibilityChange() {
  if (
    settings.options[MODULE_ID] &&
    wakeLock === null &&
    document.visibilityState === 'visible'
  ) {
    await requestWakeLock();
  }
}

/**
 * @type {import("./module").DubPlusModule}
 */
export const keepAwake = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'general',
  turnOn() {
    requestWakeLock();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  },
  turnOff() {
    wakeLock?.release();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  },
};

import { logInfo } from '../../utils/logger';
import {
  registerVisibilityChangeListeners,
  unRegisterVisibilityChangeListeners,
} from '../stores/activeTabState.svelte';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

const MODULE_ID = 'auto-afk';

/*
state transitions:

active -> idle
  - start timer
	- if timer expires, enable afk

idle -> active
	- stop timer
  - FYI: not going to disable AFK, once it's on the user must manually disable it
*/

/** @type {ReturnType<typeof setTimeout> | null} */
let timer = null;

function onTimerExpired() {
  if (!settings.options.afk) {
    logInfo(MODULE_ID, 'timer expired, enabling afk');
    /**
     * @type {HTMLElement | null}
     */
    const afkSwitch = document.querySelector('#dubplus-afk [role=switch]');
    afkSwitch?.click();
  } else {
    logInfo(MODULE_ID, 'timer expired, but afk is already enabled');
  }
}

function onBlur() {
  let userTime = parseInt(settings.custom['auto-afk'], 10);
  if (isNaN(userTime)) {
    userTime = 30;
  }
  logInfo(MODULE_ID, 'onBlur: starting timer for ', userTime, 'minutes');
  timer = setTimeout(onTimerExpired, userTime * 60 * 1000);
}

function onFocus() {
  if (timer) {
    logInfo(MODULE_ID, 'onFocus: clearing timer');
    clearTimeout(timer);
    timer = null;
  } else {
    logInfo(MODULE_ID, 'onFocus: no timer to clear');
  }
}

/**
 * Setup a timer that will automatically put you in AFK mode when you are
 * inactive for a certain amount of time (set by user). Inactivity is
 * determined by the window focus event.
 * @type {import("./module").DubPlusModule}
 */
export const autoAfk = {
  id: MODULE_ID,
  label: `${MODULE_ID}.label`,
  description: `${MODULE_ID}.description`,
  category: 'general',
  turnOn() {
    registerVisibilityChangeListeners(onFocus, onBlur);
  },
  turnOff() {
    unRegisterVisibilityChangeListeners(onFocus, onBlur);
    onFocus(); // to clear existing timer
  },
  custom: {
    title: `${MODULE_ID}.modal.title`,
    content: `${MODULE_ID}.modal.content`,
    placeholder: `${MODULE_ID}.modal.placeholder`,
    defaultValue: `${MODULE_ID}.modal.defaultValue`,
    maxlength: 10,
    validation(value) {
      // we can allow empty value which will just disable the feature
      if (value.trim() === '') return true;

      const num = parseInt(value, 10);
      if (value.includes('.') || isNaN(num) || num < 1) {
        return t(`${MODULE_ID}.modal.validation`);
      }
      return true;
    },
  },
};

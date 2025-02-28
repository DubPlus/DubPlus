import { logInfo } from '../../utils/logger';
import {
  registerVisibilityChangeListeners,
  unRegisterVisibilityChangeListeners,
} from '../stores/activeTabState.svelte';
import { t } from '../stores/i18n.svelte';
import { settings } from '../stores/settings.svelte';

/*
state transitions:

active -> idle
  - start timer
	- if timer expires, enabled afk

idle -> active
	- stop timer
  - FYI: not going to disable AFK, once it's on the user must manually disable it
*/

let timer = null;

function onTimerExpired() {
  if (!settings.options.afk) {
    logInfo('auto-afk timer expired, enabling afk');
    /**
     * @type {HTMLElement}
     */
    const afkSwitch = document.querySelector('#dubplus-afk [role=switch]');
    afkSwitch?.click();
  } else {
    logInfo('auto-afk timer expired, but afk is already enabled');
  }
}

function onBlur() {
  let userTime = parseInt(settings.custom['auto-afk'], 10);
  if (isNaN(userTime)) {
    userTime = 30;
  }
  logInfo('auto-afk onBlur: starting timer for ', userTime, 'minutes');
  timer = setTimeout(onTimerExpired, userTime * 60 * 1000);
}

function onFocus() {
  if (timer) {
    logInfo('auto-afk onFocus: clearing timer');
    clearTimeout(timer);
    timer = null;
  } else {
    logInfo('auto-afk onFocus: no timer to clear');
  }
}

/**
 * Setup a timer that will automatically put you in AFK mode when you are
 * inactive for a certain amount of time (set by user). Inactivity is
 * determined by the window focus event.
 * @type {import("./module").DubPlusModule}
 */
export const autoAfk = {
  id: 'auto-afk',
  label: 'auto-afk.label',
  description: 'auto-afk.description',
  category: 'general',
  turnOn() {
    registerVisibilityChangeListeners(onFocus, onBlur);
  },
  turnOff() {
    unRegisterVisibilityChangeListeners(onFocus, onBlur);
    onFocus(); // to clear existing timer
  },
  custom: {
    title: 'auto-afk.modal.title',
    content: 'auto-afk.modal.content',
    placeholder: '30',
    maxlength: 10,
    validation(value) {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) {
        return t('auto-afk.modal.validation');
      } else {
        return true;
      }
    },
  },
};

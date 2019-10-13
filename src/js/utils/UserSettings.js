/**
 * global State handler
 */

var defaults = {
  "menu": {
    "general": "open",
    "user-interface": "open",
    "settings": "open",
    "customize": "open",
    "contact": "open"
  },

  "options": {
    "dubplus-autovote": false,
    "dubplus-emotes": false,
    "dubplus-autocomplete": false,
    "mention_notifications": false,
    "dubplus_pm_notifications": false,
    "dj-notification": false,
    "dubplus-dubs-hover": false,
    "dubplus-downdubs": false,
    "dubplus-grabschat": false,
    "dubplus-split-chat": false,
    "dubplus-show-timestamp": false,
    "dubplus-hide-bg": false,
    "dubplus-hide-avatars": false,
    "dubplus-chat-only": false,
    "dubplus-video-only": false,
    "warn_redirect": false,
    "dubplus-comm-theme": false,
    "dubplus-afk": false,
    "dubplus-snow": false,
    "dubplus-custom-css": false,
    "dubplus-hide-selfie" : false,
    "dubplus-disable-video" : false,
    "dubplus-playlist-filter" : false,
    "dubplus-auto-afk": false
  },

  "custom": {
    "customAfkMessage": "[AFK] I'm not here right now.",
    "dj_notification": 1,
    "css": "",
    "bg" : "",
    "notificationSound": "",
    "auto_afk_wait" : 30 
  }
};

class UserSettings {
  srcRoot = _RESOURCE_SRC_

  constructor() {
    var _savedSettings = localStorage.getItem('dubplusUserSettings');
    if (_savedSettings) {
      try {
        let storedOpts = JSON.parse(_savedSettings);
        this.stored = Object.assign({}, defaults, storedOpts);
      } catch (err) {
        this.stored = defaults
      }
    } else {
      this.stored = defaults
    }
  }

  /**
   * Save your settings value to memory and localStorage
   * @param {String} type The section of the stored values. i.e. "menu", "options", "custom"
   * @param {String} optionName the key name of the option to store
   * @param {String|Boolean} value the new setting value to store
   * @returns {Boolean} whether it succeeded or not
   */
  save(type, optionName, value) {
    this.stored[type][optionName] = value;
    try {
      localStorage.setItem('dubplusUserSettings', JSON.stringify(this.stored));
      return true
    } catch(err) {
      console.error(`an error occured saving dubplus to localStorage`, err);
      return false
    }
  }
}

var userSettings = new UserSettings();
export default userSettings;
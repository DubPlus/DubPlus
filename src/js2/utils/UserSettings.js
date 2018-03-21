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
  "options": {},
  "custom": {},
  "srcRoot": _RESOURCE_SRC_
};

class UserSettings {
  constructor() {
    if (localStorage.dubplusUserSettings) {
      try {
        let storedOpts = JSON.parse(localStorage.dubplusUserSettings);
        this.settings = Object.assign({}, defaults, storedOpts);
      } catch (err) {
        this.settings = defaults
      }
    } else {
      this.settings = defaults
    }
  }

  save(type, optionName, value) {
    settings[type][optionName] = value;
    try {
      localStorage.setItem('dubplusUserSettings', JSON.stringify(this.settings));
    } catch(err) {
      console.error(`an error occured saving dubplus to localStorage`, err);
    }
  }
}

var userSettings = new UserSettings();
export default userSettings;
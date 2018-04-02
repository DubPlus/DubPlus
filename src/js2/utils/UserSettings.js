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

  save(type, optionName, value) {
    this.stored[type][optionName] = value;
    try {
      localStorage.setItem('dubplusUserSettings', JSON.stringify(this.stored));
    } catch(err) {
      console.error(`an error occured saving dubplus to localStorage`, err);
    }
  }
}

var userSettings = new UserSettings();
export default userSettings;
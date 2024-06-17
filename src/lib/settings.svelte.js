const STORAGE_KEY = "dubplusUserSettings";

/**
 * @typedef {object} Settings
 * @property {{[key: string]: boolean}} options
 * @property {{[key: string]: string}} menu will be either "open" or "closed"
 * @property {{[key: string]: string}} custom
 * @property {string} srcRoot
 */

const defaults = {
  // this will store all the on/off states
  options: {},

  // this will store the open/close state of the menu sections
  menu: {
    general: "open",
    "user-interface": "open",
    settings: "open",
    customize: "open",
    contact: "open",
  },

  // this will store custom strings for options like custom css, afk message, etc
  custom: {},

  // this will store the domain and path to some dubplus assets
  srcRoot: "",
};

// load saved settings from local storage on startup
let savedSettings = {};
try {
  savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY));
} catch (e) {
  console.error("Error parsing user settings", e);
}
const intialSettings = Object.assign({}, defaults, savedSettings);

intialSettings.srcRoot = import.meta.env.RESOURCE_URL;

/**
 * @type {Settings}
 */
export let settings = $state(intialSettings);

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving user settings", e);
  }
}

/**
 *
 * @param {import("../global").SettingsSections} section
 * @param {string} property
 * @param {any} value
 */
export function saveSetting(section, property, value) {
  switch (section) {
    case "option":
      settings.options[property] = value;
      break;
    case "menu":
      settings.menu[property] = value;
      break;
    case "custom":
      settings.custom[property] = value;
      break;
    default:
      throw new Error(`Invalid section ${section}`);
  }
  persist();
}

import { logError, logInfo } from "../../utils/logger";
import { migrate } from "../../utils/settings-migrate-v2";

const STORAGE_KEY_OLD = "dubplusUserSettings";
const STORAGE_KEY_NEW = "dubplusUserSettingsV2";

/**
 * @typedef {object} Settings
 * @property {{[key: string]: {enabled: boolean; value?: string}}} options
 * @property {{[key: string]: string}} menu will be either "open" or "closed"
 * @property {string} srcRoot
 */

/**
 * @typedef {object} OldSettings
 * @property {{[key: string]: boolean}} options
 * @property {{[key: string]: string}} menu will be either "open" or "closed"
 * @property {{[key: string]: string}} custom
 * @property {string} srcRoot
 */

/**
 * @type {Settings}
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

  // this will store the domain and path to some dubplus assets
  srcRoot: "",
};

/**
 * @return {Settings}
 */
function loadSettings() {
  // try loading the v2 settings first
  // if that doesn't exist, try the old settings and migrate them

  try {
    const v2Settings = JSON.parse(localStorage.getItem(STORAGE_KEY_NEW));
    if (v2Settings) {
      return /**@type {Settings}*/ (v2Settings);
    }
  } catch (e) {
    logInfo("Error loading v2 settings", e);
  }

  try {
    const oldSettings = JSON.parse(localStorage.getItem(STORAGE_KEY_OLD));
    if (oldSettings) {
      return migrate(/**@type {OldSettings}*/ (oldSettings));
    }
  } catch (e) {
    logInfo("Error loading old settings", e);
  }

  // @ts-ignore this will get merged with the defaults
  return {};
}

const intialSettings = Object.assign({}, defaults, loadSettings());

intialSettings.srcRoot = import.meta.env.RESOURCE_URL;

/**
 * @type {Settings}
 */
export let settings = $state(intialSettings);

function persist() {
  try {
    // we always store to the newer version of the settings
    localStorage.setItem(STORAGE_KEY_NEW, JSON.stringify(settings));
  } catch (e) {
    logError("Error saving user settings:", e);
  }
}

/**
 *
 * @param {import("../../global").SettingsSections} section
 * @param {string} property
 * @param {any} value
 */
export function saveSetting(section, property, value) {
  if (section === "option") {
    settings.options[property].enabled = value;
    persist();
    return;
  }

  if (section === "custom") {
    settings.options[property].value = value;
    persist();
    return;
  }

  if (section === "menu") {
    settings.menu[property] = value;
    persist();
    return;
  }

  throw new Error(`Invalid section: "${section}"`);
}

import { translations } from '../../translation';
import { logError } from '../../utils/logger';

export const locale = $state({
  current: 'en',
});

export const locales = Object.keys(translations);

/**
 *
 * @param {string} loc
 * @param {string} key
 * @param {Record<string, string|number|boolean>} vars
 */
export function translate(loc, key, vars) {
  let text = translations[loc][key];

  // default to english if no translation found.
  // we should at least have all text for english.
  if (!text && loc !== 'en') {
    text = translations['en'][key];
  }

  // if we STILL don't have text, just return the key
  // and also log the error. This is useful so we can
  // skip the translation process and just put text
  // directly in place of the key. We really shouldn't
  // do that but it could prove useful in some cases
  if (!text) {
    logError(`No translation found for ${loc}.${key}`);
    return key;
  }

  // replace any variables
  Object.keys(vars).forEach((item) => {
    const regex = new RegExp(`{{${item}}}`, 'g');
    text = text.replace(regex, vars[item]);
  });

  return text;
}

/**
 *
 * @param {string} key
 * @param {Record<string, string|number|boolean>} vars
 * @returns
 */
export function t(key, vars = {}) {
  return translate(locale.current, key, vars);
}

/**
 * @param {string} loc
 * @returns {string}
 */
export function normalizeLocale(loc) {
  // all english locales get the same translation
  if (loc.startsWith('en')) {
    return 'en';
  }
  return loc;
}

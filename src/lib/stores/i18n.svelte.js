import { translations } from "../../translation";

export const locale = $state({
  current: "en",
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

  // default to english if no translation found
  // we should at least have all text for english
  if (!text && loc !== "en") {
    text = translations["en"][key];
  }

  if (!text) {
    throw new Error(`No translation found for ${loc}.${key}`);
  }

  // replace any variables
  Object.keys(vars).forEach((item) => {
    const regex = new RegExp(`{{${item}}}`, "g");
    text = text.replace(regex, vars[item]);
  });

  return text;
}

// export const t = derived(
//   locale,
//   ($locale) =>
//     (key, vars = {}) =>
//       translate($locale, key, vars)
// );

/**
 *
 * @param {string} key
 * @param {Record<string, string|number|boolean} vars
 * @returns
 */
export function t(key, vars = {}) {
  return translate(locale.current, key, vars);
}

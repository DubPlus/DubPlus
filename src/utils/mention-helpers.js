/**
 * @param {string[]} names Array of all names user could use for mentions in chat
 */
export function getMentionRegex(names) {
  const escapedNames = names
    .map((name) =>
      name.replace(/\s+/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    )
    .filter(Boolean)
    .join('|');
  const reg = new RegExp(`\\b@?(${escapedNames})\\b`, 'ig');
  return reg;
}

/**
 * split, trim, and filter a comma-separated list of names
 * @param {string} [names]
 * @returns {string[]} Array of cleaned-up names
 */
export function split(names = '') {
  return names
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

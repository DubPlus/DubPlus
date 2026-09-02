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

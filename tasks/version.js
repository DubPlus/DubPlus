/**
 * Version parsing and comparison shared by the store submit scripts.
 *
 * The grammar here is the Chrome extension one (1 to 4 dot-separated integers,
 * each 0-65535), which is the stricter of the two stores. Any store-specific
 * validation beyond comparing two versions belongs in that store's script.
 */

/**
 * Parse a Chrome extension version ("1", "1.2", "1.2.3", "1.2.3.4" - each part
 * an integer between 0 and 65535).
 * https://developer.chrome.com/docs/extensions/reference/manifest/version
 * @param {string} version
 * @returns {number[] | null} The version parts, or null if it isn't valid.
 */
export function parseVersion(version) {
  if (typeof version !== 'string') return null;
  const parts = version.trim().split('.');
  if (parts.length === 0 || parts.length > 4) return null;
  const numbers = parts.map((part) =>
    /^\d+$/.test(part) ? Number(part) : NaN,
  );
  if (numbers.some((n) => !Number.isInteger(n) || n < 0 || n > 65535)) {
    return null;
  }
  return numbers;
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number | null} 1 if a > b, -1 if a < b, 0 if equal, null if either
 * version could not be parsed.
 */
export function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  if (!left || !right) return null;

  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

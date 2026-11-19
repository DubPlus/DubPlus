// Ported from https://github.com/supaflysnooka/queup-dead-song-finder (MIT, (c) 2026 supaflysnooka)

/**
 * @typedef {'deleted' | 'private' | 'embed-disabled'} DeadReason
 * @typedef {'ok' | DeadReason | 'rate-limited' | 'unknown'} CheckResult
 */

// wait this long before asking again to confirm a dead answer
export const CONFIRM_MS = 1000;
// pause between requests so we don't get rate limited
export const REQUEST_DELAY_MS = 1000;

/** @type {Record<string, Record<number, DeadReason>>} */
const DEAD_STATUSES = {
  youtube: { 404: 'deleted', 403: 'private', 401: 'embed-disabled' },
  soundcloud: { 404: 'deleted' },
};

/**
 * @param {string} type
 * @param {number} status
 * @returns {CheckResult}
 */
export function classifyStatus(type, status) {
  if (status === 200) return 'ok';
  if (status === 429) return 'rate-limited';
  return DEAD_STATUSES[String(type).toLowerCase()]?.[status] ?? 'unknown';
}

/**
 * @param {{type: string | null, fkid: string | null}} song
 * @returns {string | null}
 */
export function oembedUrl(song) {
  const type = String(song.type).toLowerCase();
  const fkid = String(song.fkid);
  if (type === 'youtube' && /^[A-Za-z0-9_-]{11}$/.test(fkid)) {
    return (
      'https://www.youtube.com/oembed?format=json&url=' +
      encodeURIComponent('https://www.youtube.com/watch?v=' + fkid)
    );
  }
  if (type === 'soundcloud' && /^\d+$/.test(fkid)) {
    return (
      'https://soundcloud.com/oembed?format=json&url=' +
      encodeURIComponent('https://api.soundcloud.com/tracks/' + fkid)
    );
  }
  return null;
}

/**
 * @param {{type: string | null, fkid: string | null}} song
 * @param {{fetch: typeof fetch, sleep: (ms: number) => Promise<void>}} deps
 * @returns {Promise<CheckResult>}
 */
export async function checkSong(song, deps) {
  const url = oembedUrl(song);
  if (!url) return 'unknown';

  /** @returns {Promise<CheckResult>} */
  const ask = async () => {
    try {
      const res = await deps.fetch(url, {
        credentials: 'omit',
        cache: 'no-store',
      });
      return classifyStatus(String(song.type), res.status);
    } catch {
      return 'unknown';
    }
  };

  const first = await ask();
  if (first === 'ok' || first === 'rate-limited' || first === 'unknown')
    return first;

  // deletes can't be undone, so a dead answer has to come back the same twice
  await deps.sleep(CONFIRM_MS);
  const second = await ask();
  return second === first ? first : 'unknown';
}

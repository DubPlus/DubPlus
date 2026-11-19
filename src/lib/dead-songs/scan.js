import { checkSong, REQUEST_DELAY_MS } from './check.js';
import { readPlaylistPage, deleteSong, PAGE_SIZE } from './playlists.js';

/**
 * @typedef {import('./check.js').DeadReason} DeadReason
 * @typedef {import('./playlists.js').Playlist} Playlist
 * @typedef {import('./playlists.js').Song} Song
 * @typedef {{playlist: Playlist, song: Song, result: DeadReason | 'unknown'}} Finding
 * @typedef {'done' | 'stopped' | 'rate-limited' | 'error'} ScanEnd
 * @typedef {{fetch: typeof fetch, apiBase: string, sleep: (ms: number) => Promise<void>}} LoopDeps
 */

/**
 * Checks every song of every playlist, in order, and reports the ones that aren't ok.
 * @param {Playlist[]} playlists
 * @param {LoopDeps & {signal: AbortSignal, onProgress: (checked: number) => void, onFinding: (f: Finding) => void}} deps
 * @returns {Promise<{end: ScanEnd, error?: string}>}
 */
export async function scanPlaylists(playlists, deps) {
  let checked = 0;

  for (const playlist of playlists) {
    if (playlist.totalItems === 0) continue;
    // songs added or removed mid-scan shift pages, so an entry can show up twice
    const seen = new Set();

    for (let page = 1; ; page++) {
      if (deps.signal.aborted) return { end: 'stopped' };

      let read;
      try {
        read = await readPlaylistPage(playlist.id, page, deps);
      } catch (err) {
        return { end: 'error', error: /** @type {Error} */ (err).message };
      }
      await deps.sleep(REQUEST_DELAY_MS);

      for (const song of read.songs) {
        if (deps.signal.aborted) return { end: 'stopped' };
        if (seen.has(song.entryId)) continue;
        seen.add(song.entryId);

        const result = await checkSong(song, deps);
        // stopped while the check was in flight: drop its result
        if (deps.signal.aborted) return { end: 'stopped' };
        if (result === 'rate-limited') return { end: 'rate-limited' };
        if (result !== 'ok') deps.onFinding({ playlist, song, result });

        checked += 1;
        deps.onProgress(checked);
        await deps.sleep(REQUEST_DELAY_MS);
      }

      if (read.last) break;
    }
  }

  return { end: 'done' };
}

/**
 * Deletes each finding's song from its playlist, one at a time. A failure
 * doesn't stop the rest. Deliberately not abortable: once started it finishes.
 * @param {Finding[]} findings
 * @param {LoopDeps} deps
 * @returns {Promise<{deleted: Finding[], failed: {finding: Finding, error: string}[]}>}
 */
export async function deleteFindings(findings, deps) {
  /** @type {Finding[]} */
  const deleted = [];
  /** @type {{finding: Finding, error: string}[]} */
  const failed = [];

  for (const [i, finding] of findings.entries()) {
    if (i > 0) await deps.sleep(REQUEST_DELAY_MS);
    try {
      await deleteSong(finding.playlist.id, finding.song.entryId, deps);
      deleted.push(finding);
    } catch (err) {
      failed.push({ finding, error: /** @type {Error} */ (err).message });
    }
  }

  return { deleted, failed };
}

/**
 * Rough scan length: one delay per song checked plus one per page read
 * (pages are read until a short one, so there's one extra when the count is a multiple of 20).
 * ponytail: ignores network time and the extra confirm request for dead songs, so it runs a bit short.
 * @param {number} totalSongs
 * @param {number} [delayMs]
 * @returns {number} seconds
 */
export function estimateScanSeconds(totalSongs, delayMs = REQUEST_DELAY_MS) {
  if (totalSongs <= 0) return 0;
  const pageReads = Math.floor(totalSongs / PAGE_SIZE) + 1;
  return ((totalSongs + pageReads) * delayMs) / 1000;
}

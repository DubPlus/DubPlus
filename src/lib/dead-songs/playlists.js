// Ported from https://github.com/supaflysnooka/queup-dead-song-finder (MIT, (c) 2026 supaflysnooka)

/**
 * @typedef {{id: string, name: string, totalItems: number | null}} Playlist
 * @typedef {{entryId: string, name: string | null, type: string | null, fkid: string | null}} Song
 * @typedef {{fetch: typeof fetch, apiBase: string}} ApiDeps
 */

// how many songs QueUp puts on one page of a playlist
export const PAGE_SIZE = 20;

/** QueUp answered with an HTTP status we didn't expect */
export class QueUpApiError extends Error {
  /** @param {number} status */
  constructor(status) {
    super(`QueUp answered ${status}`);
    this.name = 'QueUpApiError';
    this.status = status;
  }
}

/** @type {Record<string, string>} */
const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/**
 * QueUp stores some song names with HTML entities ("Fresh &amp; Low").
 * Decodes them once, as plain text (never via the DOM).
 * @param {string} text
 * @returns {string}
 */
export function decodeEntities(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body) => {
    if (body.charAt(0) === '#') {
      const code =
        body.charAt(1).toLowerCase() === 'x'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

/**
 * @param {import('../../types/api-response').UserPlaylistsApiResponse} body
 * @returns {Playlist[] | null}
 */
export function parsePlaylists(body) {
  const list = body?.data;
  if (!Array.isArray(list)) return null;
  return list
    .filter((p) => p && typeof p._id === 'string' && !p.removed)
    .map((p) => ({
      id: p._id,
      name: decodeEntities(String(p.name || '(unnamed)')),
      totalItems: typeof p.totalItems === 'number' ? p.totalItems : null,
    }))
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    );
}

/**
 * @param {import('../../types/api-response').PlaylistSongsApiResponse} body
 * @returns {{songs: Song[], last: boolean} | null}
 */
export function parseSongs(body) {
  const list = body?.data;
  if (!Array.isArray(list)) return null;
  /** @type {Song[]} */
  const songs = [];
  for (const entry of list) {
    // QueUp sometimes returns null inside a list
    if (!entry) continue;
    if (typeof entry._id !== 'string') return null;
    songs.push({
      entryId: entry._id,
      name: decodeEntities(entry._song?.name) || null,
      type: entry._song?.type || null,
      fkid: entry._song?.fkid || null,
    });
  }
  return { songs, last: list.length < PAGE_SIZE };
}

/**
 * @param {string} path
 * @param {ApiDeps} deps
 */
async function getJson(path, deps) {
  const res = await deps.fetch(`${deps.apiBase}/${path}`, {
    credentials: 'include',
  });
  if (res.status !== 200) throw new QueUpApiError(res.status);
  return res.json();
}

/**
 * @param {ApiDeps} deps
 * @returns {Promise<Playlist[]>}
 */
export async function listPlaylists(deps) {
  const playlists = parsePlaylists(await getJson('playlist', deps));
  if (!playlists) throw new Error("Couldn't read your playlists");
  return playlists;
}

/**
 * @param {string} playlistId
 * @param {number} page 1-based
 * @param {ApiDeps} deps
 * @returns {Promise<{songs: Song[], last: boolean}>}
 */
export async function readPlaylistPage(playlistId, page, deps) {
  const read = parseSongs(
    await getJson(`playlist/${playlistId}/songs?page=${page}`, deps),
  );
  if (!read) throw new Error(`Couldn't read page ${page} of the playlist`);
  return read;
}

/**
 * @param {string} playlistId
 * @param {string} entryId
 * @param {ApiDeps} deps
 * @returns {Promise<void>}
 */
export async function deleteSong(playlistId, entryId, deps) {
  const res = await deps.fetch(
    `${deps.apiBase}/playlist/${playlistId}/songs/${entryId}`,
    { method: 'DELETE', credentials: 'include' },
  );
  if (res.status < 200 || res.status >= 300) {
    throw new QueUpApiError(res.status);
  }
}

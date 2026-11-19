import { apiBase } from '../api.js';
import { listPlaylists } from './playlists.js';
import { scanPlaylists, deleteFindings } from './scan.js';

/**
 * @typedef {import('./playlists.js').Playlist} Playlist
 * @typedef {import('./scan.js').Finding} Finding
 * @typedef {import('./scan.js').ScanEnd} ScanEnd
 * @typedef {Finding & {selected: boolean, error?: string}} Row
 */

const deps = {
  fetch: window.fetch.bind(window),
  apiBase,
  sleep: (/** @type {number} */ ms) =>
    new Promise((resolve) => setTimeout(resolve, ms)),
};

function initialState() {
  return {
    open: false,
    minimized: false,
    /** @type {Playlist[]} */
    playlists: [],
    scanning: false,
    checked: 0,
    total: 0,
    /** @type {Row[]} */
    findings: [],
    /** @type {ScanEnd | null} */
    end: null,
    /** @type {string | null} */
    error: null,
    deleting: false,
    /** @type {{deleted: number, failed: number} | null} */
    summary: null,
  };
}

export const deadSongs = $state(initialState());

/** @type {AbortController | null} */
let controller = null;
// the delete run in progress. A forced close marks it stale: its requests
// can't be cancelled, so it keeps `deleting` true (blocking new scans and
// deletes) until it finishes, but its results aren't written into the reset state
/** @type {{stale: boolean} | null} */
let deleteRun = null;

export function openDeadSongs() {
  deadSongs.open = true;
  deadSongs.minimized = false;
  if (deadSongs.playlists.length === 0) {
    listPlaylists(deps)
      .then((playlists) => {
        deadSongs.playlists = playlists;
      })
      .catch((/** @type {Error} */ err) => {
        deadSongs.error = err.message;
      });
  }
}

/**
 * @param {string[]} playlistIds
 */
export function startScan(playlistIds) {
  if (deadSongs.scanning || deadSongs.deleting) return;
  const playlists = deadSongs.playlists.filter((p) =>
    playlistIds.includes(p.id),
  );

  Object.assign(deadSongs, {
    scanning: true,
    checked: 0,
    total: playlists.reduce((sum, p) => sum + (p.totalItems ?? 0), 0),
    findings: [],
    end: null,
    error: null,
    summary: null,
  });

  const ours = new AbortController();
  controller = ours;
  scanPlaylists(playlists, {
    ...deps,
    signal: ours.signal,
    onProgress: (checked) => {
      if (controller === ours) deadSongs.checked = checked;
    },
    onFinding: (finding) => {
      if (controller === ours) {
        deadSongs.findings.push({ ...finding, selected: false });
      }
    },
  }).then(({ end, error }) => {
    // the dialog was closed (state reset) while this scan was finishing
    if (controller !== ours) return;
    controller = null;
    deadSongs.scanning = false;
    deadSongs.end = end;
    deadSongs.error = error ?? null;
  });
}

export function stopScan() {
  controller?.abort();
}

export function minimize() {
  deadSongs.minimized = true;
}

export function restore() {
  deadSongs.minimized = false;
}

/**
 * @param {{force?: boolean}} [options] force: close even while deleting (Dub+ is unmounting)
 */
export function closeDeadSongs({ force = false } = {}) {
  if (deadSongs.deleting && !force) return;
  stopScan();
  controller = null;
  if (deleteRun) deleteRun.stale = true;
  Object.assign(deadSongs, initialState());
  deadSongs.deleting = deleteRun !== null;
}

export async function deleteSelected() {
  const rows = deadSongs.findings.filter(
    (r) => r.selected && r.result !== 'unknown',
  );
  if (rows.length === 0 || deadSongs.scanning || deadSongs.deleting) return;

  deadSongs.deleting = true;
  const ours = { stale: false };
  deleteRun = ours;
  const { deleted, failed } = await deleteFindings(
    // plain copies: the loop shouldn't hold onto reactive proxies
    rows.map(({ playlist, song, result }) => ({ playlist, song, result })),
    deps,
  );
  deleteRun = null;
  if (ours.stale) {
    deadSongs.deleting = false;
    return;
  }

  const deletedIds = deleted.map((f) => f.song.entryId);
  /** @type {Record<string, string>} */
  const failedErrors = Object.fromEntries(
    failed.map((f) => [f.finding.song.entryId, f.error]),
  );

  deadSongs.findings = deadSongs.findings
    .filter((r) => !deletedIds.includes(r.song.entryId))
    .map((r) =>
      r.song.entryId in failedErrors
        ? { ...r, error: failedErrors[r.song.entryId] }
        : r,
    );
  deadSongs.summary = { deleted: deleted.length, failed: failed.length };
  deadSongs.deleting = false;
}

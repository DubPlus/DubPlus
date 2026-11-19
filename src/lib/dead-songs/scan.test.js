import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanPlaylists, deleteFindings, estimateScanSeconds } from './scan.js';

const apiBase = 'https://api.test';
const DEAD = 'deadDeadDea'; // 11 chars, a valid youtube id
const P1 = { id: 'p1', name: 'P', totalItems: 20 };

/** @param {number} i @param {string} [fkid] */
const entry = (i, fkid) => ({
  _id: 'e' + i,
  _song: {
    name: 'song ' + i,
    type: 'youtube',
    fkid: fkid ?? `alive${String(i).padStart(6, '0')}`,
  },
});

/**
 * Fake network. `pages[playlistId][page]` is the entry list, or a status number to fail with.
 * oEmbed: DEAD → 404, `oembedStatus` for the rest (default 200).
 * @param {{pages: Record<string, Record<number, any[] | number>>, oembedStatus?: number}} opts
 */
function fakeFetch({ pages, oembedStatus = 200 }) {
  /** @type {string[]} */
  const calls = [];
  /** @type {any} */
  const fetch = async (/** @type {string} */ url) => {
    calls.push(url);
    const m = /\/playlist\/(\w+)\/songs\?page=(\d+)$/.exec(url);
    if (m) {
      const page = pages[m[1]]?.[Number(m[2])] ?? [];
      if (typeof page === 'number')
        return { status: page, json: async () => ({}) };
      return { status: 200, json: async () => ({ data: page }) };
    }
    if (url.includes(DEAD)) return { status: 404 };
    return { status: oembedStatus };
  };
  return { fetch, calls };
}

/** @param {ReturnType<typeof fakeFetch>['fetch']} fetch */
function scanDeps(fetch, overrides = {}) {
  return {
    fetch,
    apiBase,
    sleep: async () => {},
    signal: new AbortController().signal,
    onProgress: () => {},
    onFinding: () => {},
    ...overrides,
  };
}

const twentySongs = Array.from({ length: 20 }, (_, i) =>
  entry(i, i === 5 ? DEAD : undefined),
);

test('scanPlaylists pages until a short page and reports dead songs', async () => {
  const { fetch, calls } = fakeFetch({
    pages: { p1: { 1: twentySongs, 2: [] } },
  });
  /** @type {any[]} */
  const findings = [];
  let checked = 0;
  const r = await scanPlaylists(
    [P1],
    scanDeps(fetch, {
      onFinding: (/** @type {any} */ f) => findings.push(f),
      onProgress: (/** @type {number} */ n) => (checked = n),
    }),
  );
  assert.deepEqual(r, { end: 'done' });
  assert.equal(checked, 20);
  assert.deepEqual(
    findings.map((f) => [f.playlist.id, f.song.fkid, f.result]),
    [['p1', DEAD, 'deleted']],
  );
  assert.equal(calls.filter((u) => u.includes('/songs?page=')).length, 2);
});

test('scanPlaylists skips empty playlists without requests', async () => {
  const { fetch, calls } = fakeFetch({ pages: {} });
  const r = await scanPlaylists(
    [{ id: 'p0', name: 'Empty', totalItems: 0 }],
    scanDeps(fetch),
  );
  assert.deepEqual(r, { end: 'done' });
  assert.equal(calls.length, 0);
});

test('scanPlaylists stops on abort', async () => {
  const { fetch } = fakeFetch({ pages: { p1: { 1: twentySongs } } });
  const controller = new AbortController();
  let checked = 0;
  const r = await scanPlaylists(
    [P1],
    scanDeps(fetch, {
      signal: controller.signal,
      onProgress: (/** @type {number} */ n) => {
        checked = n;
        if (n === 3) controller.abort();
      },
    }),
  );
  assert.deepEqual(r, { end: 'stopped' });
  assert.equal(checked, 3);
});

test('scanPlaylists stops on 429', async () => {
  const { fetch } = fakeFetch({
    pages: { p1: { 1: twentySongs } },
    oembedStatus: 429,
  });
  let checked = 0;
  const r = await scanPlaylists(
    [P1],
    scanDeps(fetch, { onProgress: (/** @type {number} */ n) => (checked = n) }),
  );
  assert.deepEqual(r, { end: 'rate-limited' });
  assert.equal(checked, 0);
});

test('scanPlaylists stops with an error when QueUp fails, keeping findings', async () => {
  const { fetch } = fakeFetch({ pages: { p1: { 1: twentySongs, 2: 500 } } });
  /** @type {any[]} */
  const findings = [];
  const r = await scanPlaylists(
    [P1],
    scanDeps(fetch, { onFinding: (/** @type {any} */ f) => findings.push(f) }),
  );
  assert.equal(r.end, 'error');
  assert.match(r.error ?? '', /500/);
  assert.equal(findings.length, 1);
});

test('scanPlaylists reports unknown songs as findings', async () => {
  const { fetch } = fakeFetch({
    pages: {
      p1: { 1: [{ _id: 'x', _song: { name: 'v', type: 'vimeo', fkid: '1' } }] },
    },
  });
  /** @type {any[]} */
  const findings = [];
  await scanPlaylists(
    [P1],
    scanDeps(fetch, { onFinding: (/** @type {any} */ f) => findings.push(f) }),
  );
  assert.deepEqual(
    findings.map((f) => f.result),
    ['unknown'],
  );
});

test('scanPlaylists drops the in-flight result when aborted during a check', async () => {
  const controller = new AbortController();
  const { fetch: base } = fakeFetch({ pages: { p1: { 1: [entry(1, DEAD)] } } });
  /** @type {any} */
  const fetch = async (/** @type {string} */ url) => {
    const res = await base(url);
    if (url.includes(DEAD)) controller.abort(); // user closes while the check is in flight
    return res;
  };
  /** @type {any[]} */
  const findings = [];
  let progressCalls = 0;
  const r = await scanPlaylists(
    [P1],
    scanDeps(fetch, {
      signal: controller.signal,
      onFinding: (/** @type {any} */ f) => findings.push(f),
      onProgress: () => progressCalls++,
    }),
  );
  assert.deepEqual(r, { end: 'stopped' });
  assert.equal(findings.length, 0);
  assert.equal(progressCalls, 0);
});

test('scanPlaylists checks an entry only once when pages shift during a scan', async () => {
  // a song added mid-scan pushes e19 from page 1 onto page 2
  const page2 = [entry(19, DEAD)];
  const page1 = Array.from({ length: 20 }, (_, i) =>
    entry(i, i === 19 ? DEAD : undefined),
  );
  const { fetch } = fakeFetch({ pages: { p1: { 1: page1, 2: page2 } } });
  /** @type {any[]} */
  const findings = [];
  let checked = 0;
  await scanPlaylists(
    [P1],
    scanDeps(fetch, {
      onFinding: (/** @type {any} */ f) => findings.push(f),
      onProgress: (/** @type {number} */ n) => (checked = n),
    }),
  );
  assert.deepEqual(
    findings.map((f) => f.song.entryId),
    ['e19'],
  );
  assert.equal(checked, 20);
});

test('deleteFindings continues past failures', async () => {
  /** @type {string[]} */
  const calls = [];
  /** @type {any} */
  const fetch = async (/** @type {string} */ url) => {
    calls.push(url);
    return { status: url.endsWith('/e2') ? 500 : 200 };
  };
  const findings = [1, 2, 3].map((i) => ({
    playlist: P1,
    song: { entryId: 'e' + i, name: 'n', type: 'youtube', fkid: DEAD },
    result: /** @type {const} */ ('deleted'),
  }));
  const r = await deleteFindings(findings, {
    fetch,
    apiBase,
    sleep: async () => {},
  });
  assert.deepEqual(
    r.deleted.map((f) => f.song.entryId),
    ['e1', 'e3'],
  );
  assert.equal(r.failed.length, 1);
  assert.equal(r.failed[0].finding.song.entryId, 'e2');
  assert.match(r.failed[0].error, /500/);
  assert.equal(calls.length, 3);
});

test('estimateScanSeconds counts one delay per song and per page read', () => {
  // 126 songs + 7 page reads at 1000ms
  assert.equal(estimateScanSeconds(126, 1000), 133);
  // 20 songs + 2 page reads (the second page comes back empty)
  assert.equal(estimateScanSeconds(20, 1000), 22);
  assert.equal(estimateScanSeconds(1, 1000), 2);
  assert.equal(estimateScanSeconds(0, 1000), 0);
});

test('scanPlaylists reports a 429 from QueUp as rate-limited', async () => {
  const { fetch } = fakeFetch({ pages: { p1: { 1: 429 } } });
  const r = await scanPlaylists([P1], scanDeps(fetch));
  assert.deepEqual(r, { end: 'rate-limited' });
});

test('scanPlaylists retries a failed page read once before giving up', async () => {
  const { fetch: base } = fakeFetch({
    pages: { p1: { 1: twentySongs, 2: [] } },
  });
  let failedOnce = false;
  /** @type {any} */
  const fetch = async (/** @type {string} */ url) => {
    if (url.endsWith('?page=2') && !failedOnce) {
      failedOnce = true;
      return { status: 503, json: async () => ({}) };
    }
    return base(url);
  };
  const r = await scanPlaylists([P1], scanDeps(fetch));
  assert.deepEqual(r, { end: 'done' });
});

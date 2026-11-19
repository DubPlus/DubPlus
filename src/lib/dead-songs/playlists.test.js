import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeEntities,
  parseSongs,
  parsePlaylists,
  listPlaylists,
  readPlaylistPage,
  deleteSong,
  QueUpApiError,
} from './playlists.js';

const apiBase = 'https://api.test';

/** @param {number} i */
const entry = (i) => ({
  _id: 'e' + i,
  _song: { name: 'n', type: 'youtube', fkid: 'f' },
});

test('decodeEntities decodes once', () => {
  assert.equal(decodeEntities('Fresh &amp; Low'), 'Fresh & Low');
  assert.equal(decodeEntities('&amp;lt;b&amp;gt;'), '&lt;b&gt;');
  assert.equal(decodeEntities('it&#39;s'), "it's");
});

test('parseSongs marks a full page as not last and a short page as last', () => {
  const full = parseSongs({
    data: Array.from({ length: 20 }, (_, i) => entry(i)),
  });
  assert.equal(full?.last, false);
  assert.equal(parseSongs({ data: [] })?.last, true);
  assert.deepEqual(parseSongs({ data: [null, entry(1)] })?.songs, [
    { entryId: 'e1', name: 'n', type: 'youtube', fkid: 'f' },
  ]);
  assert.equal(parseSongs({ data: [{ _id: 5 }] }), null);
  assert.equal(parseSongs({}), null);
});

test('parseSongs decodes song names', () => {
  const body = {
    data: [
      {
        _id: 'e',
        _song: { name: 'Fresh &amp; Low', type: 'youtube', fkid: 'f' },
      },
    ],
  };
  assert.equal(parseSongs(body)?.songs[0].name, 'Fresh & Low');
});

test('parsePlaylists drops removed and sorts naturally', () => {
  const body = {
    data: [
      { _id: 'b', name: 'Mix 10', totalItems: 1 },
      { _id: 'a', name: 'mix 2', totalItems: 0 },
      { _id: 'c', name: 'Gone', removed: true },
    ],
  };
  assert.deepEqual(parsePlaylists(body), [
    { id: 'a', name: 'mix 2', totalItems: 0 },
    { id: 'b', name: 'Mix 10', totalItems: 1 },
  ]);
  assert.equal(parsePlaylists({ data: 'nope' }), null);
});

test('listPlaylists sends cookies and throws on non-200', async () => {
  /** @type {any} */
  let seen;
  /** @type {any} */
  const fetch = async (/** @type {string} */ url, /** @type {any} */ opts) => {
    seen = { url, opts };
    return { status: 401, json: async () => ({}) };
  };
  await assert.rejects(listPlaylists({ fetch, apiBase }));
  assert.equal(seen.url, 'https://api.test/playlist');
  assert.equal(seen.opts.credentials, 'include');
});

test('readPlaylistPage reads the 1-based page and throws on unparseable body', async () => {
  /** @type {string[]} */
  const urls = [];
  /** @type {any} */
  const fetch = async (/** @type {string} */ url) => {
    urls.push(url);
    return {
      status: 200,
      json: async () => (url.endsWith('=1') ? { data: [entry(1)] } : {}),
    };
  };
  const page = await readPlaylistPage('p1', 1, { fetch, apiBase });
  assert.equal(page.last, true);
  assert.equal(page.songs.length, 1);
  await assert.rejects(readPlaylistPage('p1', 2, { fetch, apiBase }));
  assert.deepEqual(urls, [
    'https://api.test/playlist/p1/songs?page=1',
    'https://api.test/playlist/p1/songs?page=2',
  ]);
});

test('deleteSong sends DELETE with cookies and throws on failure', async () => {
  /** @type {any[]} */
  const calls = [];
  /** @type {any} */
  const fetch = async (/** @type {string} */ url, /** @type {any} */ opts) => {
    calls.push([url, opts.method, opts.credentials]);
    return { status: url.endsWith('bad') ? 500 : 200 };
  };
  await deleteSong('p1', 'e1', { fetch, apiBase });
  await assert.rejects(deleteSong('p1', 'bad', { fetch, apiBase }));
  assert.deepEqual(calls[0], [
    'https://api.test/playlist/p1/songs/e1',
    'DELETE',
    'include',
  ]);
});

test('parsePlaylists decodes playlist names', () => {
  const body = { data: [{ _id: 'a', name: 'Rock &amp; Roll', totalItems: 1 }] };
  assert.equal(parsePlaylists(body)?.[0].name, 'Rock & Roll');
});

test('failed QueUp requests reject with a QueUpApiError carrying the status', async () => {
  /** @type {any} */
  const fetch = async () => ({ status: 429, json: async () => ({}) });
  await assert.rejects(readPlaylistPage('p1', 1, { fetch, apiBase }), (err) => {
    assert.ok(err instanceof QueUpApiError);
    assert.ok(err instanceof Error);
    assert.equal(err.status, 429);
    assert.equal(err.message, 'QueUp answered 429');
    return true;
  });
  await assert.rejects(
    deleteSong('p1', 'e1', { fetch, apiBase }),
    (err) => err instanceof QueUpApiError && err.status === 429,
  );
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyStatus, oembedUrl, checkSong } from './check.js';

const noSleep = async () => {};
const YT = { type: 'youtube', fkid: 'dQw4w9WgXcQ' };

/** @param {number[]} statuses */
function fetchSequence(statuses) {
  return async () => ({ status: statuses.shift() });
}

test('classifyStatus maps youtube statuses', () => {
  assert.equal(classifyStatus('youtube', 200), 'ok');
  assert.equal(classifyStatus('youtube', 404), 'deleted');
  assert.equal(classifyStatus('youtube', 403), 'private');
  assert.equal(classifyStatus('youtube', 401), 'embed-disabled');
  assert.equal(classifyStatus('YouTube', 429), 'rate-limited');
  assert.equal(classifyStatus('youtube', 400), 'unknown');
  assert.equal(classifyStatus('youtube', 500), 'unknown');
});

test('classifyStatus maps soundcloud statuses', () => {
  assert.equal(classifyStatus('soundcloud', 200), 'ok');
  assert.equal(classifyStatus('soundcloud', 404), 'deleted');
  assert.equal(classifyStatus('soundcloud', 403), 'unknown');
  assert.equal(classifyStatus('soundcloud', 429), 'rate-limited');
});

test('oembedUrl rejects unsupported songs', () => {
  assert.equal(oembedUrl({ type: 'spotify', fkid: 'x' }), null);
  assert.equal(oembedUrl({ type: 'youtube', fkid: 'short' }), null);
  assert.equal(oembedUrl({ type: 'soundcloud', fkid: 'abc' }), null);
  assert.equal(
    oembedUrl(YT),
    'https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ',
  );
  assert.equal(
    oembedUrl({ type: 'soundcloud', fkid: '123' }),
    'https://soundcloud.com/oembed?format=json&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F123',
  );
});

test('checkSong confirms a dead status twice', async () => {
  const result = await checkSong(YT, {
    fetch: fetchSequence([404, 404]),
    sleep: noSleep,
  });
  assert.equal(result, 'deleted');
});

test('checkSong returns unknown when the confirm disagrees', async () => {
  const result = await checkSong(YT, {
    fetch: fetchSequence([404, 200]),
    sleep: noSleep,
  });
  assert.equal(result, 'unknown');
});

test('checkSong does not confirm ok or rate-limited answers', async () => {
  assert.equal(
    await checkSong(YT, { fetch: fetchSequence([200]), sleep: noSleep }),
    'ok',
  );
  assert.equal(
    await checkSong(YT, { fetch: fetchSequence([429]), sleep: noSleep }),
    'rate-limited',
  );
});

test('checkSong never fetches an unsupported song and survives network errors', async () => {
  let calls = 0;
  const fetch = async () => {
    calls++;
    throw new TypeError('network');
  };
  assert.equal(
    await checkSong({ type: 'vimeo', fkid: '1' }, { fetch, sleep: noSleep }),
    'unknown',
  );
  assert.equal(calls, 0);
  assert.equal(
    await checkSong(
      { type: 'soundcloud', fkid: '123' },
      { fetch, sleep: noSleep },
    ),
    'unknown',
  );
  assert.equal(calls, 1);
});

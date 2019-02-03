import twitch from '../../src/js2/utils/emotes/twitch.js';
import bttv from '../../src/js2/utils/emotes/bttv.js';
import ldb from '../../src/js2/utils/indexedDB.js';
import {shouldUpdateAPIs} from '../../src/js2/utils/emotes/updateCheck';

describe('shouldUpdateAPIs test', ()=>{
  test('shouldUpdateAPIs returns true when item doesnt exist in indexedDB', async ()=>{
    var update = await shouldUpdateAPIs("fake")
    expect(update).toEqual(true);
  })
  
  test('shouldUpdateAPIs returns true when indexedDB item has error property', async ()=>{
    ldb.set("fake_api", JSON.stringify({ error: true }) );
    var update = await shouldUpdateAPIs("fake")
    expect(update).toEqual(true);
  });
  
  test('shouldUpdateAPIs returns true when indexedDB item cant be JSON parsed', async ()=>{
    ldb.set("fake_api", 'x' );
    var update = await shouldUpdateAPIs("fake")
    expect(update).toEqual(true);
  });
  
  test('shouldUpdateAPIs returns true when timestamp doesnt exist', async ()=>{
    ldb.set("fake_api", JSON.stringify({emote: 'face'}) );
    var update = await shouldUpdateAPIs("fake")
    expect(update).toEqual(true);
  });
  
  test('shouldUpdateAPIs returns false when item exists and does not need to be refreshed', async ()=>{
    ldb.set("fake_api", JSON.stringify({emote: 'face'}) );
    localStorage.setItem("fake_api_timestamp", Date.now().toString());
    var update = await shouldUpdateAPIs("fake")
    expect(update).toEqual(false);
  });
});

describe('twitch class tests', ()=>{

  test('twitch loads from api', async () => {
    jest.setTimeout(30000);
    await twitch.load()
    expect(twitch.loaded).toEqual('from api');
    expect(Object.keys(twitch.emotes).length).toBeGreaterThan(1000);
    expect(twitch.emotes['kappa']).toBeTruthy();
    expect(localStorage.twitch_api_timestamp).toBeTruthy();
  
  });

  test('twitch loads from indexedDB', async () => {
    await twitch.load();
    expect(twitch.loaded).toEqual('from db');
    expect(Object.keys(twitch.emotes).length).toBeGreaterThan(1000);
    expect(twitch.emotes['kappa']).toBeTruthy();
    expect(localStorage.twitch_api_timestamp).toBeTruthy();
  });

});


describe('bttv class tests', ()=>{
  test('bttv loads from api', async () => {
    await bttv.load();
    expect(bttv.loaded).toBe(true);
    expect(Object.keys(bttv.emotes).length).toBeGreaterThan(50);
  });
});

afterAll(()=>{
  localStorage.clear();
  let rq = indexedDB.deleteDatabase('d2');
  rq.onerror = function(event) {
    console.log("Error deleting database.");
  };
})
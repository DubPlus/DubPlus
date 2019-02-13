import twitch from "@/utils/emotes/twitch-local.js";
import bttv from "@/utils/emotes/bttv.js";
import ldb from "@/utils/indexedDB.js";
import { shouldUpdateAPIs } from "@/utils/emotes/updateCheck";

describe("shouldUpdateAPIs test", () => {
  test("shouldUpdateAPIs returns true when item doesnt exist in indexedDB", async () => {
    var update = await shouldUpdateAPIs("fake");
    expect(update).toEqual(true);
  });

  test("shouldUpdateAPIs returns true when indexedDB item has error property", async () => {
    ldb.set("fake_api", JSON.stringify({ error: true }));
    var update = await shouldUpdateAPIs("fake");
    expect(update).toEqual(true);
  });

  test("shouldUpdateAPIs returns true when indexedDB item cant be JSON parsed", async () => {
    ldb.set("fake_api", "x");
    var update = await shouldUpdateAPIs("fake");
    expect(update).toEqual(true);
  });

  test("shouldUpdateAPIs returns true when timestamp doesnt exist", async () => {
    ldb.set("fake_api", JSON.stringify({ emote: "face" }));
    var update = await shouldUpdateAPIs("fake");
    expect(update).toEqual(true);
  });

  test("shouldUpdateAPIs returns false when item exists and does not need to be refreshed", async () => {
    ldb.set("fake_api", JSON.stringify({ emote: "face" }));
    localStorage.setItem("fake_api_timestamp", Date.now().toString());
    var update = await shouldUpdateAPIs("fake");
    expect(update).toEqual(false);
  });
});

describe("bttv class tests", () => {
  test("bttv loads from api", async () => {
    await bttv.load();
    expect(bttv.loaded).toBe(true);
    expect(Object.keys(bttv.emotes).length).toBeGreaterThan(50);
  });
});

afterAll(done => {
  localStorage.clear();
  let rq = indexedDB.deleteDatabase("d2");
  rq.onerror = function(event) {
    console.log("Error deleting database.");
  };
  rq.onsuccess = done;
});

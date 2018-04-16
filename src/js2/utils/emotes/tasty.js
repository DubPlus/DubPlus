import getJSON from "../getJSON/.js";
import ldb from "./indexedDB.js";
import settings from '../UserSettings.js';

class TastyEmotes {
  emotes = {};
  loaded = false;

  constructor() {
    console.log("dub+", "tasty", "loading from api");
    // since we control this API we should always have it load from remote
    var tastyApi = getJSON(
      settings.srcRoot + "/emotes/tastyemotes.json",
      "tasty:loaded"
    );

    tastyApi.then(data => {
      ldb.set("tasty_api", JSON.stringify(data));
      this.processEmotes(JSON.parse(data));
    });

  }

  template(id) {
    return this.emotes[id].url;
  }

  processEmotes(data) {
    this.emotes = data.emotes;
    this.loaded = true;
  }
}

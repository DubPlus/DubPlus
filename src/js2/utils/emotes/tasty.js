import getJSON from "../getJSON.js";
import ldb from "../indexedDB.js";
import settings from '../UserSettings.js';
import {
  shouldUpdateAPIs
} from './prepEmoji.js';

class TastyEmotes {
  emotes = {};
  loaded = false;

  load() {
    return shouldUpdateAPIs("tasty")
      .then(update => {
        if (update) {
          return this.updateFromAPI();
        }

        return this.loadFromDB();
      });

  }

  loadFromDB() {
    return new Promise((resolve, reject) => {
      try {
        ldb.get("tasty_api", (data) => {
          console.log("dub+", "tasty", "loading from IndexedDB");
          let savedData = JSON.parse(data);
          this.processEmotes(savedData);
          savedData = null; // clear the var from memory
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  updateFromAPI() {
    console.log("dub+", "tasty", "loading from api");

    var tastyApi = getJSON(
      settings.srcRoot + "/emotes/tastyemotes.json"
    );

    return tastyApi.then(data => {
      ldb.set("tasty_api", JSON.stringify(data));
      this.processEmotes(JSON.parse(data));
      localStorage.setItem("tasty_api_timestamp", Date.now().toString());
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

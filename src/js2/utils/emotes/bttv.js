import getJSON from "../getJSON.js";
import ldb from "../indexedDB.js";
import { shouldUpdateAPIs } from './prepEmoji.js';
/* global  emojify */

class BTTVemotes {
  emotes = {};
  sortedKeys = {
    'nonAlpha' : []
  }
  loaded = false;
  headers = {};

  optionalSetHeaders(obj) {
    this.headers = obj;
  }

  load() {
    // if it doesn't exist in localStorage or it's older than 5 days
    // grab it from the bttv API
    return shouldUpdateAPIs("bttv")
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
        ldb.get("bttv_api", (data) => {
          console.log("dub+", "bttv", "loading from IndexedDB");
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
    console.log("dub+", "bttv", "loading from api");

    var bttvApi = getJSON(
      "https://api.betterttv.net/2/emotes",
      this.headers
    );

    return bttvApi.then(json => {
      var bttvEmotes = {};
      json.emotes.forEach(e => {
        if (!bttvEmotes[e.code]) {
          bttvEmotes[e.code] = e.id;
        }
      });
      localStorage.setItem("bttv_api_timestamp", Date.now().toString());
      ldb.set("bttv_api", JSON.stringify(bttvEmotes));
      this.processEmotes(bttvEmotes);
    });
  }

  template(id) {
    return `//cdn.betterttv.net/emote/${id}/3x`;
  }

  addKeyToSorted = (key) => {
    let first = key.charAt(0);

    // all numbers and symbols get stored in one 'nonAlpha' array
    if (!/[a-z]/i.test(first)) {
      this.sortedKeys.nonAlpha.push(key);
      return;
    }

    if (!this.sortedKeys[first]) {
      this.sortedKeys[first] = [];
    }
    
    this.sortedKeys[first].push(key);
  }

  find(symbol) {
    let first = symbol.charAt(0);
    let arr;
    if (!/[a-z]/i.test(first)) {
      arr = this.sortedKeys.nonAlpha
    } else {
      arr = this.sortedKeys[first] || [];
    }

    var matchBttvKeys = arr.filter(key => key.indexOf(symbol) === 0);
    return matchBttvKeys.map(key => {
      return {
        type: "bttv",
        src: this.template(this.emotes[key]),
        name: key
      }
    });
  }

  processEmotes(data) {
    for (var code in data) {
      if (data.hasOwnProperty(code)) {
        var _key = code.toLowerCase();

        if (code.indexOf(":") >= 0) {
          continue; // don't want any emotes with smileys and stuff
        }

        if (emojify.emojiNames.indexOf(_key) >= 0) {
          continue; // do nothing so we don't override emoji
        }

        if (code.indexOf("(") >= 0) {
          _key = _key.replace(/([()])/g, "");
        }

        this.emotes[_key] = data[code];
        this.addKeyToSorted(_key);
      }
    }

    this.loaded = true;
  }
}

var bttv = new BTTVemotes();
export default bttv;
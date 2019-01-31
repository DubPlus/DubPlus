/**************************************************************************
 * Loads the twitch emotes from the api.
 * http://api.twitch.tv/kraken/chat/emoticon_images
 */
import getJSON from "../getJSON.js";
import ldb from "../indexedDB.js";
import { shouldUpdateAPIs } from "./prepEmoji.js";
/* global  emojify */

/**
 * Handles loading emotes from api and storing them locally
 *
 * @class TwitchEmotes
 */
class TwitchEmotes {
  specialEmotes = [];
  emotes = {};
  sortedKeys = {
    nonAlpha: []
  };
  loaded = false;

  load() {
    console.time("twitch_load");
    // if it doesn't exist in indexedDB or it's older than 5 days
    // grab it from the twitch API
    return shouldUpdateAPIs("twitch").then(update => {
      if (update) {
        return this.updateFromApi();
      }
      return this.grabFromDb();
    });
  }

  grabFromDb() {
    return new Promise((resolve, reject) => {
      try {
        ldb.get("twitch_api", data => {
          console.timeEnd("twitch_load");
          console.log("dub+", "twitch", "loading from IndexedDB");
          let savedData = JSON.parse(data);
          // this.processEmotes(savedData);
          this.processViaWebWorker(savedData);
          this.loaded = "from db";
          savedData = null; // clear the var from memory
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  updateFromApi() {
    console.log("dub+", "twitch", "loading from api");

    let corsEsc = "https://cors-escape.herokuapp.com";
    let twApi = getJSON(
      `${corsEsc}/https://api.twitch.tv/kraken/chat/emoticon_images`
    );

    return twApi.then(json => {
      console.timeEnd("twitch_load");
      let twitchEmotes = {};
      json.emoticons.forEach(e => {
        if (!twitchEmotes[e.code] || e.emoticon_set === null) {
          // if emote doesn't exist OR
          // override if it's a global emote (null set = global emote)
          twitchEmotes[e.code] = e.id;
        }
      });
      localStorage.setItem("twitch_api_timestamp", Date.now().toString());
      ldb.set("twitch_api", JSON.stringify(twitchEmotes));
      // this.processEmotes(twitchEmotes);
      this.processViaWebWorker(twitchEmotes);
      this.loaded = "from api";
    });
  }

  template(id) {
    return `//static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`;
  }

  addKeyToSorted = key => {
    let first = key.charAt(0);

    // all numbers and symbols get stored in one 'nonAlpha' array
    if (!/[a-z]/i.test(first)) {
      this.sortedKeys.nonAlpha.push(key);
      return;
    }

    if (!this.sortedKeys[first]) {
      this.sortedKeys[first] = [key];
      return;
    }

    this.sortedKeys[first].push(key);
  };

  find(symbol) {
    let first = symbol.charAt(0);
    let arr;
    if (!/[a-z]/i.test(first)) {
      arr = this.sortedKeys.nonAlpha;
    } else {
      arr = this.sortedKeys[first] || [];
    }

    var matchTwitchKeys = arr.filter(key => key.indexOf(symbol) === 0);
    return matchTwitchKeys.map(key => {
      return {
        type: "twitch",
        src: this.template(this.emotes[key]),
        name: key
      };
    });
  }

  processEmotes(data) {
    console.time("twitch_process");
    for (var code in data) {
      if (data.hasOwnProperty(code)) {
        var _key = code.toLowerCase();

        // move twitch non-named emojis to their own array
        // for now we are doing nothing with them
        if (code.indexOf("\\") >= 0) {
          this.specialEmotes.push([code, data[code]]);
          continue;
        }

        if (emojify.emojiNames.indexOf(_key) >= 0) {
          continue; // don't override regular emojis handled by emojify
        }

        if (!this.emotes[_key]) {
          // if emote doesn't exist, add it
          this.emotes[_key] = data[code];
          this.addKeyToSorted(_key);
        }
      }
    }
    console.timeEnd("twitch_process");
  }

  /**
   * In order to speed up the initial load of the script I'm using a web worker
   * do some of the more cpu expensive and UI blocking work
   * help from: https://stackoverflow.com/a/10372280/395414
   */
  processViaWebWorker(data) {
    // URL.createObjectURL
    window.URL = window.URL || window.webkitURL;

    let response = `
      var emotes = {};
      var sortedKeys = {
        'nonAlpha' : []
      };

      function addKeyToSorted(key) {
        let first = key.charAt(0);
    
        // all numbers and symbols get stored in one 'nonAlpha' array
        if (!/[a-z]/i.test(first)) {
          sortedKeys.nonAlpha.push(key);
          return;
        }
    
        if (!sortedKeys[first]) {
          sortedKeys[first] = [key];
          return
        }
    
        sortedKeys[first].push(key);
      }

      self.addEventListener('message', function(e) {
        var emojiNames = e.data.emojiNames;
        var data = e.data.data;

        for (var code in data) {
          if (data.hasOwnProperty(code)) {
            var _key = code.toLowerCase();
      
            // not doing anything with non-named emojis
            if (/\\\\/g.test(code)) {
              continue;
            }
      
            if (emojiNames.indexOf(_key) >= 0) {
              continue; // don't override regular emojis handled by emojify
            }
      
            if (!emotes[_key]) {
              // if emote doesn't exist, add it
              emotes[_key] = data[code];
              addKeyToSorted(_key);
            }
          }
        }

        self.postMessage({
          emotes: emotes,
          sortedKeys: sortedKeys
        });
      }, false);
    `;
    var blob;
    try {
      blob = new Blob([response], { type: "application/javascript" });
    } catch (e) {
      // Backwards-compatibility
      window.BlobBuilder =
        window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
      blob = new BlobBuilder();
      blob.append(response);
      blob = blob.getBlob();
    }
    var worker = new Worker(URL.createObjectURL(blob));

    worker.addEventListener("message", e => {
      this.emotes = e.data.emotes;
      this.sortedKeys = e.data.sortedKeys;
    });

    worker.postMessage({
      data: data,
      emojiNames: emojify.emojiNames
    });
  }
}

var twitch = new TwitchEmotes();

export default twitch;

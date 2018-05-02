/**************************************************************************
 * Loads the twitch emotes from the api.
 * http://api.twitch.tv/kraken/chat/emoticon_images
 */
import getJSON from "../getJSON.js";
import ldb from "./indexedDB.js";
import {
  shouldUpdateAPIs
} from './prepEmoji.js';
/* global  emojify */

/**
 * Handles loading emotes from api and storing them locally
 * 
 * @class TwitchEmotes
 */
class TwitchEmotes {
  specialEmotes  = []
  emotes = {}
  loaded = false

  download () {
    // if it doesn't exist in localStorage or it's older than 5 days
    // grab it from the twitch API
    shouldUpdateAPIs("twitch").then(update => {
      if (update) {
        console.log("dub+", "twitch", "loading from api");

        let twApi = getJSON(
          "https://api.twitch.tv/kraken/chat/emoticon_images",
          "twitch:loaded",
          {
            Accept: "application/vnd.twitchtv.v5+json",
            "Client-ID": "z5bpa7x6y717dsw28qnmcooolzm2js"
          }
        );

        twApi.then(data => {
          let json = JSON.parse(data);
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
          this.processEmotes(twitchEmotes);
        });
        return;
      }

      ldb.get("twitch_api").then(data => {
        console.log("dub+", "twitch", "loading from IndexedDB");
        let savedData = JSON.parse(data);
        this.processEmotes(savedData);
        savedData = null; // clear the var from memory
        let twEvent = new Event("twitch:loaded");
        window.dispatchEvent(twEvent);
      });
    })
    .catch(function(err){
      console.log(err);
    });
  }

  template (id) {
    return `//static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`;
  }

  processEmotes(data) {
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
        }
      }
    }
    this.loaded = true;
  }

}

var twitch = new TwitchEmotes();

export default twitch;


/**
 * Twitch emotes
 *
 * No longer loading twitch emotes from API and using indexedDB
 * Instead of loading the 80,000 (or whatever) possible twitch emotes I've reduced
 * the emotes to just 15 channels[1] plus global, which is about ~800 emotes
 * (similar in size to the regular emoji)
 *
 * [1] https://github.com/FranciscoG/emoji-spritesheet/blob/master/lib/downloadTwitch.js
 */
import twitchSpriteSheet from "./twitch-spritesheet";

const twitch = {
  get(name) {
    let emoteData =
      twitchSpriteSheet[name] || twitchSpriteSheet[name.toLowerCase()];
    if (emoteData) {
      return this.template(emoteData.id);
    }
    return null;
  },

  template(id) {
    return `//static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`;
  },

  /**
   * @param {string} symbol the emote name without the enclosing colons
   * @returns {array} an array of matches
   */
  find(symbol) {
    return Object.keys(twitchSpriteSheet)
      .filter(key => key.toLowerCase().indexOf(symbol.toLowerCase()) === 0)
      .map(name => {
        let obj = twitchSpriteSheet[name];
        obj.name = name;
        obj.type = "twitch";
        return obj;
      });
  }
};

export default twitch;

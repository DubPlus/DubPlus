import '../../utils/ldb'; // loads ldb into the window object
import { logError, logInfo } from '../../utils/logger';

/**
 * Promisify version of `window.ldb.get`
 * @param {string} key
 * @returns {Promise<string>}
 */
function ldbGet(key) {
  return new Promise((resolve) => {
    window.ldb.get(key, function (data) {
      resolve(data);
    });
  });
}

/**
 * @typedef {object} TwitchEmote
 * @property {string} description
 * @property {string} image_id
 * @property {string|null} first_seen
 */

/**
 * @typedef {object} TwitchJsonResponse
 * @property {object} meta
 * @property {string} meta.generated_at
 * @property {object} template
 * @property {string} template.small
 * @property {string} template.medium
 * @property {string} template.large
 * @property {{[emote: string]: TwitchEmote}} emotes
 */

/**
 *
 * @returns {Promise<TwitchJsonResponse>}
 */
function fetchTwitchEmotes() {
  return fetch(
    '//cdn.jsdelivr.net/gh/Jiiks/BetterDiscordApp/data/emotedata_twitch_global.json',
  ).then((res) => res.json());
}

/**
 * @typedef {object} BttvEmote
 * @property {string} id
 * @property {string} code
 * @property {string} imageType
 * @property {boolean} animated
 * @property {string} userId
 * @property {boolean} modifier
 */
/**
 * @typedef {BttvEmote[]} BttvJsonResponse
 */

/**
 * @returns {Promise<BttvJsonResponse>}
 */
function fetchBTTVEmotes() {
  return fetch('//api.betterttv.net/3/cached/emotes/global').then((res) =>
    res.json(),
  );
}

/**
 * @typedef {object} FrankerFacezEmote
 * @property {number} id
 * @property {string} name
 * @property {number} height
 * @property {number} width
 * @property {boolean} public
 * @property {boolean} hidden
 * @property {boolean} modifier
 * @property {number} modifier_flags
 * @property {null} offset
 * @property {null} margins
 * @property {null} css
 * @property {{_id: number, name: string, display_name: string}} owner
 * @property {null} artist
 * @property {{1: string, 2: string, 4: string}} urls
 * @property {number} status
 * @property {number} usage_count
 * @property {string} created_at
 * @property {string} last_updated
 */

/**
 * @typedef {object} FrankerFacezJsonResponse
 * @property {number} _pages
 * @property {number} _total
 * @property {FrankerFacezEmote[]} emoticons
 */

/**
 * @returns {Promise<FrankerFacezJsonResponse>}
 */
function fetchFrankerFacezEmotes() {
  return fetch(
    '//api.frankerfacez.com/v1/emoticons?per_page=200&private=off&sort=count-desc',
  ).then((res) => res.json());
}

export const dubplus_emoji = {
  emoji: {
    /**
     * @param {string} id
     * @returns {string}
     */
    template(id) {
      id = id.replace(/:/g, '');
      return `${window.emojify.defaultConfig.img_dir}/${encodeURI(id)}.png`;
    },
  },
  twitchJSONSLoaded: false,
  bttvJSONSLoaded: false,
  tastyJSONLoaded: false,
  frankerfacezJSONLoaded: false,

  twitch: {
    /**
     * @param {string} id
     * @returns {string}
     */
    template(id) {
      return `//static-cdn.jtvnw.net/emoticons/v1/${id}/3.0`;
    },
    /**
     * @type {Map<string, string>}
     */
    emotesMap: new Map(),
    chatRegex: new RegExp(':([-_a-z0-9]+):', 'ig'),
  },
  bttv: {
    /**
     * @param {string} id
     * @returns {string}
     */
    template(id) {
      return `//cdn.betterttv.net/emote/${id}/3x`;
    },
    /**
     * @type {Map<string, string>}
     */
    emotesMap: new Map(),
    chatRegex: new RegExp(':([&!()\\-_a-z0-9]+):', 'ig'),
  },
  tasty: {
    /**
     * @param {string} id
     * @returns {string}
     */
    template(id) {
      return this.emotesMap.get(id).url;
    },
    /**
     * @type {Map<string, {url: string, width: number, height: number}>}
     */
    emotesMap: new Map(),
  },
  frankerFacez: {
    /**
     * @param {number} id
     * @returns {string}
     */
    template(id) {
      return `//cdn.frankerfacez.com/emoticon/${id}/1`;
    },
    /**
     * @type {Map<string, number>}
     */
    emotesMap: new Map(),
    chatRegex: new RegExp(':([-_a-z0-9]+):', 'ig'),
  },

  /**
   *
   * @param {string} apiName
   * @returns {Promise<boolean>}
   */
  shouldUpdateAPIs(apiName) {
    const day = 86400000; // milliseconds in a day
    // if api return an object with an error then we should try again
    return ldbGet(`${apiName}_api`).then((savedItem) => {
      if (savedItem) {
        try {
          const parsed = JSON.parse(savedItem);
          if (typeof parsed.error !== 'undefined') {
            return true;
          }
        } catch {
          // if we can't parse the data then we should update
          return true;
        }
      }

      const today = Date.now();
      const lastSaved = parseInt(
        localStorage.getItem(`${apiName}_api_timestamp`),
      );
      // Is the lastsaved not a number for some strange reason, then we should update
      // are we past 5 days from last update? then we should update
      // does the data not exist in localStorage, then we should update
      return isNaN(lastSaved) || today - lastSaved > day * 5 || !savedItem;
    });
  },
  /**************************************************************************
   * Loads the twitch emotes from the api.
   * http://api.twitch.tv/kraken/chat/emoticon_images
   */

  /**
   * @return {Promise<void>}
   */
  loadTwitchEmotes() {
    if (this.twitchJSONSLoaded) {
      return Promise.resolve();
    }

    // if it doesn't exist in localStorage or it's older than 5 days
    // grab it from the twitch API
    return this.shouldUpdateAPIs('twitch').then((shouldUpdate) => {
      if (shouldUpdate) {
        logInfo('twitch', 'loading from api');
        return fetchTwitchEmotes()
          .then((json) => {
            /**
             * @type {{[emote: string]: string}}
             */
            const twitchEmotes = {};
            for (const emote in json.emotes) {
              if (!twitchEmotes[emote]) {
                // if emote doesn't exist, add it
                twitchEmotes[emote] = json.emotes[emote].image_id;
              }
            }
            localStorage.setItem('twitch_api_timestamp', Date.now().toString());
            window.ldb.set('twitch_api', JSON.stringify(twitchEmotes));
            dubplus_emoji.processTwitchEmotes(twitchEmotes);
          })
          .catch((err) => logError(err));
      } else {
        return ldbGet('twitch_api').then((data) => {
          logInfo('twitch', 'loading from IndexedDB');
          /**
           * @type {{[emote: string]: string}}
           */
          const savedData = JSON.parse(data);
          dubplus_emoji.processTwitchEmotes(savedData);
        });
      }
    });
  },

  /**
   * @return {Promise<void>}
   */
  loadBTTVEmotes() {
    if (this.bttvJSONSLoaded) {
      return Promise.resolve();
    }
    // if it doesn't exist in localStorage or it's older than 5 days
    // grab it from the bttv API
    return this.shouldUpdateAPIs('bttv').then((shouldUpdate) => {
      if (shouldUpdate) {
        logInfo('bttv', 'loading from api');
        return fetchBTTVEmotes()
          .then((json) => {
            /**
             * @type {{[emote: string]: string}}
             */
            const bttvEmotes = {};

            json.forEach((e) => {
              if (!bttvEmotes[e.code]) {
                // if emote doesn't exist, add it
                bttvEmotes[e.code] = e.id;
              }
            });
            localStorage.setItem('bttv_api_timestamp', Date.now().toString());
            window.ldb.set('bttv_api', JSON.stringify(bttvEmotes));
            dubplus_emoji.processBTTVEmotes(bttvEmotes);
          })
          .catch((err) => logError(err));
      } else {
        return ldbGet('bttv_api').then((data) => {
          logInfo('bttv', 'loading from IndexedDB');
          /**
           * @type {{[emote: string]: string}}
           */
          const savedData = JSON.parse(data);
          dubplus_emoji.processBTTVEmotes(savedData);
        });
      }
    });
  },

  /**
   * @return {Promise<void>}
   */
  loadTastyEmotes() {
    if (this.tastyJSONLoaded) {
      return Promise.resolve();
    }
    logInfo('tasty', 'loading from api');
    // since we control this API we should always have it load from remote
    // @ts-ignore __SRC_ROOT__ is replaced by vite
    // eslint-disable-next-line no-undef
    return fetch(`${__SRC_ROOT__}/emotes/tastyemotes.json`)
      .then((res) => res.json())
      .then((json) => {
        window.ldb.set('tasty_api', JSON.stringify(json));
        dubplus_emoji.processTastyEmotes(json);
      })
      .catch((err) => logError(err));
  },

  /**
   * @return {Promise<void>}
   */
  loadFrankerFacez() {
    if (this.frankerfacezJSONLoaded) {
      return Promise.resolve();
    }
    // if it doesn't exist in localStorage or it's older than 5 days
    // grab it from the frankerfacez API
    return this.shouldUpdateAPIs('frankerfacez').then((shouldUpdate) => {
      if (shouldUpdate) {
        logInfo('frankerfacez', 'loading from api');
        return fetchFrankerFacezEmotes()
          .then((json) => {
            const frankerFacez = json;
            localStorage.setItem(
              'frankerfacez_api_timestamp',
              Date.now().toString(),
            );
            window.ldb.set('frankerfacez_api', JSON.stringify(frankerFacez));
            dubplus_emoji.processFrankerFacez(frankerFacez);
          })
          .catch((err) => logError(err));
      } else {
        return ldbGet('frankerfacez_api').then((data) => {
          logInfo('frankerfacez', 'loading from IndexedDB');
          const savedData = JSON.parse(data);
          dubplus_emoji.processFrankerFacez(savedData);
        });
      }
    });
  },

  /**
   *
   * @param {{[emote: string]: string}} data
   */
  processTwitchEmotes(data) {
    for (const code in data) {
      if (Object.hasOwn(data, code)) {
        const key = code.toLowerCase();

        if (window.emojify.emojiNames.includes(key)) {
          continue; // do nothing so we don't override emoji
        }

        this.twitch.emotesMap.set(key, data[code]);
      }
    }
    this.twitchJSONSLoaded = true;
  },

  /**
   * @param {{[emote: string]: string}} data
   */
  processBTTVEmotes(data) {
    for (const code in data) {
      if (Object.hasOwn(data, code)) {
        const key = code.toLowerCase();

        if (code.indexOf(':') >= 0) {
          continue; // don't want any emotes with smileys and stuff
        }

        if (window.emojify.emojiNames.indexOf(key) >= 0) {
          continue; // do nothing so we don't override emoji
        }

        if (!this.twitch.emotesMap.has(key)) {
          this.bttv.emotesMap.set(key, data[code]);
        }
      }
    }
    this.bttvJSONSLoaded = true;
  },

  /**
   * @param {{[emote: string]: { url: string; width: number; height: number; }}} data
   */
  processTastyEmotes(data) {
    this.tasty.emotes = data.emotes;
    this.tastyJSONLoaded = true;
    Object.keys(this.tasty.emotes).forEach((key) => {
      this.tasty.emotesMap.set(key, data[key]);
    });
  },

  /**
   * @param {FrankerFacezJsonResponse} data
   */
  processFrankerFacez(data) {
    for (const emoticon of data.emoticons) {
      const code = emoticon.name;
      const key = code.toLowerCase();

      if (code.indexOf(':') >= 0) {
        continue; // don't want any emotes with smileys and stuff
      }

      if (window.emojify.emojiNames.includes(key)) {
        continue; // do nothing so we don't override emojify emoji
      }

      if (!this.twitch.emotesMap.has(key) && !this.bttv.emotesMap.has(key)) {
        this.frankerFacez.emotesMap.set(key, emoticon.id);
      }
    }
    this.frankerfacezJSONLoaded = true;
  },

  /**
   * @param {string} str
   * @param {boolean} [emotesEnabled=false]
   */
  findMatchingEmotes(str, emotesEnabled = false) {
    /**
     * @type {import("./emojiTypes").Emoji[]}
     */
    const matches = [];

    // first we check the QueUp native emoji
    window.emojify.emojiNames.forEach((emoji) => {
      if (emoji.includes(str)) {
        matches.push({
          src: this.emoji.template(emoji),
          text: emoji,
          alt: emoji,
          platform: 'emojify',
        });
      }
    });
    if (!emotesEnabled) {
      return matches;
    }
    Array.from(this.twitch.emotesMap.keys()).forEach((emoji) => {
      if (emoji.includes(str)) {
        matches.push({
          src: this.twitch.template(this.twitch.emotesMap.get(emoji)),
          text: emoji,
          alt: emoji,
          platform: 'twitch',
        });
      }
    });
    Array.from(this.bttv.emotesMap.keys()).forEach((emoji) => {
      if (emoji.includes(str)) {
        matches.push({
          src: this.bttv.template(this.bttv.emotesMap.get(emoji)),
          text: emoji,
          alt: emoji,
          platform: 'bttv',
        });
      }
    });

    Array.from(this.frankerFacez.emotesMap.keys()).forEach((emoji) => {
      if (emoji.includes(str)) {
        matches.push({
          src: this.frankerFacez.template(
            this.frankerFacez.emotesMap.get(emoji),
          ),
          text: emoji,
          alt: emoji,
          platform: 'ffz',
        });
      }
    });

    return matches;
  },
};

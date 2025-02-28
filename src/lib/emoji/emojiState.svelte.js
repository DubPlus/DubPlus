/**
 * @typedef {import('./emojiTypes').Emoji} Emoji
 */

/**
 * @typedef {object} EmojiState
 * @property {number} selectedIndex
 * @property {Emoji[]} emojiList
 */

/**
 * @type {EmojiState}
 */
export const emojiState = $state({
  selectedIndex: 0,
  emojiList: [],
});

export function reset() {
  emojiState.selectedIndex = 0;
  emojiState.emojiList = [];
}

/**
 * @param {Emoji[]} listArray
 */
export function setEmojiList(listArray) {
  // make listArray unique by emoji.src and emoji.platform
  emojiState.emojiList = listArray
    .filter(
      (emoji, index, self) =>
        index ===
        self.findIndex(
          (e) => e.src === emoji.src && e.platform === emoji.platform,
        ),
    )
    .sort((a, b) => {
      // sort by platform in the following order: emojify, twitch, bttv, ffz, tasty
      // then sort by text ascending
      const platforms = ['emojify', 'twitch', 'bttv', 'ffz', 'tasty'];
      const platformA = platforms.indexOf(a.platform);
      const platformB = platforms.indexOf(b.platform);
      if (platformA === platformB) {
        return a.text.localeCompare(b.text);
      }
      return platformA - platformB;
    });
}

export function decrement() {
  if (emojiState.selectedIndex > 0) {
    emojiState.selectedIndex--;
  } else {
    emojiState.selectedIndex = emojiState.emojiList.length - 1;
  }
}

export function increment() {
  if (emojiState.selectedIndex < emojiState.emojiList.length - 1) {
    emojiState.selectedIndex++;
  } else {
    emojiState.selectedIndex = 0;
  }
}

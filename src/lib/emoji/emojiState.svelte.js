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
  emojiState.emojiList = listArray;
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

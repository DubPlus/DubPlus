/**
 *
 * @param {string} char
 * @returns {boolean}
 */
export function isEdge(char) {
  return char === ' ' || char === '\n';
}

/**
 * Assuming that the selectionStart is adjacent to, or within, a partial emoji,
 * get the selection range of the partial emoji
 *
 * "This is a :cat example" -> [10, 14]
 *            ^^^^^ cursor can be anywhere in this range
 * @param {string} currentText
 * @param {number} cursorPos
 * @returns {[number, number]}
 */
export function getSelection(currentText, cursorPos) {
  let left = cursorPos > 0 ? cursorPos : 0;

  // keep going left until we find the start of the partial emoji
  while (left > 0 && currentText[left] !== ':') {
    left -= 1;
  }

  let right = cursorPos;
  // keep going right until we hit a space or newline
  while (!isEdge(currentText[right]) && right < currentText.length) {
    right += 1;
  }

  return [left, right];
}

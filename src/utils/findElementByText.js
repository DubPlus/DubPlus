/**
 * Finds the first DOM element wrapping a text node that exactly matches
 * `targetText` (after trimming whitespace). Uses a `TreeWalker` to visit
 * only text nodes.
 * @param {string} targetText the text to search for
 * @returns {Element | null} the matching element, or `null` if none was found
 */
export function findElementByText(targetText) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  let node;
  while ((node = walker.nextNode())) {
    if ((node.textContent ?? '').trim().includes(targetText)) {
      return node.parentElement;
    }
  }

  return null;
}

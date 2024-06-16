/**
 *
 * @param {HTMLElement} node
 * @param {string} containerSelector
 * @returns {{destroy: () => void}}
 */
export function teleport(node, containerSelector) {
  const teleportContainer = document.querySelector(containerSelector);
  teleportContainer.appendChild(node);

  return {
    destroy() {
      node.remove();
    },
  };
}

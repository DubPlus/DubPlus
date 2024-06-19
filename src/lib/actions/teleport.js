/**
 *
 * @param {HTMLElement} node
 * @param {[string, ("append" | "prepend")?]} containerSelector
 * @returns {{destroy: () => void}}
 */
export function teleport(node, [selector, position = "append"]) {
  const teleportContainer = document.querySelector(selector);
  if (!teleportContainer) {
    throw new Error(`teleport container not found: ${selector}`);
  }
  if (position === "append") {
    teleportContainer.appendChild(node);
  } else {
    teleportContainer.prepend(node);
  }

  return {
    destroy() {
      node.remove();
    },
  };
}

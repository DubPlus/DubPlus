/**
 * This helps render a component or element in a different part of the DOM
 * outside of the component's parent.
 *
 * @param {HTMLElement} node
 * @param {{to: string, position?: "append" | "prepend"}} containerSelector
 * @returns {{destroy: () => void}}
 */
export function teleport(node, { to, position = 'append' }) {
  const teleportContainer = document.querySelector(to);
  if (!teleportContainer) {
    throw new Error(`teleport container not found: ${to}`);
  }
  if (position === 'append') {
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

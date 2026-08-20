import { logError } from '../../utils/logger.js';
import { waitFor } from '../../utils/waitFor.js';

/**
 * This helps render an element to a different part of the DOM
 * outside of the component's parent.
 * @type {import('svelte/action').Action<HTMLElement, {to: string | (() => HTMLElement | null | undefined), position?: "append" | "prepend"}>}
 */
export const teleport = (node, initialParams) => {
  let { to, position = 'append' } = initialParams;

  function init() {
    // 1. Clear out any previous clones matching this ID during hot reload
    if (node.id) {
      document.getElementById(node.id)?.remove();
    } else {
      logError('teleport node must have an id', node);
    }

    const getTeleportContainer = () =>
      typeof to === 'string' ? document.querySelector(to) : to();

    waitFor(() => !!getTeleportContainer(), { seconds: 5 })
      .then(() => {
        const teleportContainer = getTeleportContainer();
        if (teleportContainer) {
          if (position === 'append') {
            teleportContainer.appendChild(node);
          } else {
            teleportContainer.prepend(node);
          }
        }
      })
      .catch(() => {
        logError(`teleport container not found: ${to}`);
      });
  }

  // Run immediately on creation
  init();

  return {
    update(newParams) {
      // Handles cases where parameters dynamically change over time
      to = newParams.to;
      position = newParams.position ?? 'append';
      init();
    },
    destroy() {
      // 3. Absolute cleanup. Fires reliably on unmount and hot-reload.
      node.remove();
    },
  };
};

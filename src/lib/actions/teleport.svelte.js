import { logError } from '../../utils/logger.js';
import { waitFor } from '../../utils/waitFor.js';
/**
 * This helps render an element to a different part of the DOM
 * outside of the component's parent.
 * @type {import('svelte/action').Action<HTMLElement, {to: string, position?: "append" | "prepend"}>}
 */
export const teleport = (node, { to, position = 'append' }) => {
  $effect(() => {
    if (node.id) {
      document.getElementById(node.id)?.remove();
    }
    waitFor(() => !!document.querySelector(to), { seconds: 5 })
      .then(() => {
        const teleportContainer = document.querySelector(to);
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

    return () => {
      node.remove();
    };
  });
};

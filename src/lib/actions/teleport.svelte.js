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
    const teleportContainer = document.querySelector(to);
    if (!teleportContainer) {
      throw new Error(`teleport container not found: ${to}`);
    }
    if (position === 'append') {
      teleportContainer.appendChild(node);
    } else {
      teleportContainer.prepend(node);
    }

    return () => {
      node.remove();
    };
  });
};

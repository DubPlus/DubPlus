export const activeTabState = $state({ isActive: true });

/**
 * An array of functions to call when the visibility state changes to hidden.
 * @type {Set<() => void>}
 */
// Ignoring this because this Set is just for internal use and not reactive
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const onOut = new Set();

/**
 * An array of functions to call when the visibility state changes to visible.
 * @type {Set<() => void>}
 */
// Ignoring this because this Set is just for internal use and not reactive
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const onIn = new Set();

document.addEventListener('visibilitychange', handleChange);

window.onpageshow = handleChange;
window.onpagehide = handleChange;
window.onfocus = handleChange;
window.onblur = handleChange; // Changing tab with alt+tab

// Initialize state if Page Visibility API is supported
if (document.hidden !== undefined) {
  handleChange({ type: document.hidden ? 'blur' : 'focus' });
}

/**
 *
 * @param {Partial<PageTransitionEvent | FocusEvent>} evt
 */
function handleChange(evt) {
  if (
    activeTabState.isActive &&
    (['blur', 'pagehide'].includes(evt.type ?? '') || document.hidden)
  ) {
    activeTabState.isActive = false;
    onOut.forEach((fn) => fn());
  } else if (
    !activeTabState.isActive &&
    (['focus', 'pageshow'].includes(evt.type ?? '') || !document.hidden)
  ) {
    activeTabState.isActive = true;
    onIn.forEach((fn) => fn());
  }
}

/**
 *
 * @param {() => void} inHandler
 * @param {() => void} outHandler
 */
export function registerVisibilityChangeListeners(inHandler, outHandler) {
  if (inHandler) onIn.add(inHandler);
  if (outHandler) onOut.add(outHandler);
}

/**
 *
 * @param {() => void} inHandler
 * @param {() => void} outHandler
 */
export function unRegisterVisibilityChangeListeners(inHandler, outHandler) {
  if (inHandler) onIn.delete(inHandler);
  if (outHandler) onOut.delete(outHandler);
}

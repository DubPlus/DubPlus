export const activeTabState = $state({ isActive: true });

/**
 * An array of functions to call when the visibility state changes to hidden.
 * @type {Array<() => void>}
 */
const onOut = [];

/**
 * An array of functions to call when the visibility state changes to visible.
 * @type {Array<() => void>}
 */
const onIn = [];

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
    (['blur', 'pagehide'].includes(evt.type) || document.hidden)
  ) {
    activeTabState.isActive = false;
    onOut.forEach((fn) => fn());
  } else if (
    !activeTabState.isActive &&
    (['focus', 'pageshow'].includes(evt.type) || !document.hidden)
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
  if (inHandler) onIn.push(inHandler);
  if (outHandler) onOut.push(outHandler);
}

/**
 *
 * @param {() => void} inHandler
 * @param {() => void} outHandler
 */
export function unRegisterVisibilityChangeListeners(inHandler, outHandler) {
  if (inHandler) onIn.splice(onIn.indexOf(inHandler), 1);
  if (outHandler) onOut.splice(onOut.indexOf(outHandler), 1);
}

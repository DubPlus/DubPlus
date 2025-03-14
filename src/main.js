import './dubplus.css';
import { mount, unmount } from 'svelte';
import DubPlus from './DubPlus.svelte';
import { loadCSS } from './utils/css';
import { logError, logInfo } from './utils/logger';

const loadedAsExtension = 'dubplusExtensionLoaded' in window;

// @ts-ignore
logInfo('Dub+: loaded as extension:', loadedAsExtension);

// If loading this script as an extension it will come with the
// css locally. But if it's not loaded as an extension (i.e. Bookmarklet),
// we need to load the CSS file from the CDN.
if (!import.meta.env.DEV && !loadedAsExtension) {
  loadCSS('/dubplus.css', 'dubplus-css').catch((e) => {
    logError('Failed to load dubplus.css', e);
  });
}

let container = document.getElementById('dubplus-container');
if (!container) {
  // Dub+ has not been loaded yet so we need to create the container
  container = document.createElement('div');
  container.id = 'dubplus-container';
  document.body.appendChild(container);
} else if (container.children.length > 0) {
  // Dub+ has already been loaded so we need to unmount it first
  unmount(container);
  container.innerHTML = '';
}

const app = mount(DubPlus, {
  target: container,
});

export default app;

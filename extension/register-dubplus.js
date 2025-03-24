// this is just a simple way to let us know that the dubplus.js script was
// loaded via an extension rather than via a bookmarklet. This file must be
// registered as a content_script in the manifest.json file. It must come before
// dubplus.js and run at document_start
window.dubplusExtensionLoaded = true;

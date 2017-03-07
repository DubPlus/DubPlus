## Web Extension info

- :warning: **Don't touch the /Chrome and /Firefox folders**
- make any changes to the extension in the `/common` folder
- run `npm run ext` to build the Chrome and Firefox folders.


The extensions share the same codebase, it only has slight differences in the manifest.json file. If you need to make browser-specific changes to the manifest file then update in the appropriate file:

`manifest.core.json` - shared manifest items go here    
`manifest.chrome.json` - Chrome-only manfest items go here    
`manifest.firefox.json` - Firefox-only manifest items go here

In the past we've had no need to worry about browser-specific extension APIs, but if we needed to do that then we could start doing stuff like this in one JS file:

```javascript
  if (typeof chrome !== "undefined") {
    // do chrome extension api stuff
  } else {
    // do Firefox related stuff
  }
```

helpful links:

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Porting_a_Google_Chrome_extension

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Chrome_incompatibilities

Deploying via API

FF: https://www.npmjs.com/package/firefox-extension-deploy

Chrome: https://developer.chrome.com/webstore/using_webstore_api
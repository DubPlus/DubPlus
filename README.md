# DubPlus

Dub+ - A Dubtrack.fm and QueUp.net script/extension for added features and customizations

## How to build the extension

1. Install [Node](https://nodejs.org/) (version >= v22)
2. Run `npm install` in the root of this repo
3. Run `npm run build` to build and zip the extension.
   - This will create a zip file of the extension at: `./dist/dubplus-extension.zip`

The extension will load into any browser that supports the WebExtensions API and manifest v3 (Chrome, Firefox, Edge, etc.). Please note that we've only tested the extension on Chrome and Firefox and we only make it available on their respective extension stores. See https://dub.plus for more details.

## Contributing

- Fork us
- Create separate branch(es) to develop in
- Create a Pull Request targeting DubPlus's `develop` branch
- We will verify and test the changes before we merge it into our main branch

## Development

Requires [Node](https://nodejs.org/) version >= 22 with `npm` version >= 10

- install dependencies: `npm install`

The UI is written in [Svelte 5](https://svelte.dev/docs/svelte/overview)

There are 2 ways you can develop.

### 1. Loading the extension in Firefox

- in one command line window or tab, run `npm run watch`
- in a separate command line, run `npm run firefox`.

This will launch firefox and with the extension already loaded.

PROS:

- When you make changes and save, it will automatically reload the extension for you, no need to refresh the page (well, sometimes you need to refresh but rarely, working on fixing that)

CONS:

- The browser it loads is a completely fresh window with a clean storage (cookies and localStorage) so you'll need to log in and enable all of the features every time you start it up (just once per session, not every time you save during development)

### 2. Loading the unpacked extension in Chrome

This way is a little more manual but it's good to test on Chrome when you're finished developing on Firefox to make sure it works well in both browsers.

- run `npm run watch`
- open [chrome://extensions/](chrome://extensions/)
- if you have the Dub+ extension installed from the Chrome WebStore, make sure to disable it
- Turn on the "developer mode" switch in the top right
- Click on "Load unpacked" button in the top left
- select the `extension` folder of this repo
- Open a new tab and log in to https://queup.net and join a room
- Start developing.

When you hit save, the `watch` will automatically rebuid the JS and CSS files. When you're ready to test your changes you'll need to do the following:

- go back to the [chrome://extensions/](chrome://extensions/)
- click on the little refresh icon next to the switch in the bottom right corner of the "unpacked extension"
- then go back to the QueUp page and refresh the browser

PROS:

- No need to log in every time and enable features, it uses the normal browser and has access to cookies and localStorage.

CONS:

- The process of seeing your changes after save is a little slower and not automatic.

### npm scripts

`npm run build` - Lints src, builds files from sources, then builds the extension zip

`npm run ci:build` - Lints and compiles the JS and CSS files. Does **not** build the zip

`npm run watch` - starts file watcher that will rebuild dubplus.js and dubplus.css on save

`npm run firefox` - starts an instance of Firefox with our extension loaded so you can test it in Firefox. Requires that you have Firefox installed locally already

`npm run prettier` - format all files in the repo

`npm run purge-cache` - purges the jsDelivr cache for Dub+

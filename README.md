# DubPlus

Dub+ - A Dubtrack.fm and QueUp.net script/extension for added features and customizations

## How to build the extension

Requires [Node](https://nodejs.org/) v22 or higher. If you're using [`nvm`](https://github.com/nvm-sh/nvm), you can run `nvm use`.

Run `npm install` to install dependencies.

Run `npm run ext` to build and zip the extension.

This will create a new folder with a zip file: `web-ext-artifacts/dubplus-x.x.x.zip`

The extension will load into any browser that supports the WebExtensions API and manifest v3 (Chrome, Firefox, Edge, Opera, Vivaldi, etc.). Please note that we've only tested the extension on Chrome and Firefox and we only make it available on their respective extension stores. See https://dub.plus for more details.

## Contributing

- Fork us
- Create separate branch(es) to develop in
- Create a Pull Request targeting DubPlus's `develop` branch
- We will verify and test the changes before we merge it into our main branch

## Development

Requires Node v22 or higher

- install dependencies: `npm install`

The UI is written in [Svelte 5](https://svelte.dev/docs/svelte/overview)

There are 2 ways you can develop.

### 1. Loading the extension in Firefox

- in one command line window or tab, run `npm run watch`
- in another command line, run `npm run firefox`.

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
- select the root folder of this repo
- Open a new tab and log in to https://queup.net and join a room
- start developing

PROS:

- No need to log in every time and enable features, it uses the normal browser and has access to cookies and localStorage.

CONS:

- When you make changes and hit save, you'll need to go into the [chrome://extensions/](chrome://extensions/) and reload the extension every time (there's a little reload icon the left of the switch in the extension page, just click on that), and then go to the page and refresh the page as well.

### npm scripts

`npm run build` - creates production builds of the JS and CSS files

`npm run watch` - Starts file watcher that will rebuild dubplus.js and dubplus.css on save

`npm run ext` - shortcut that runs `npm run build` then `npm run zip`

`npm run zip` - creates the zip file of the extension

`npm run firefox` - starts an instance of firefox with our extension loaded so you can test it in Firefox. Requires that you have FireFox installed locally already

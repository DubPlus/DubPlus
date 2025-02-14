# DubPlus
Dub+ - A Dubtrack.fm and QueUp.net script/extension for added features and customizations

## How to build the extension
- First make sure you have installed [Node](https://nodejs.org/) version 20 or higher
  - if you're using [`nvm`](https://github.com/nvm-sh/nvm), you can just run `nvm use` inside the root of the repo
- Run `npm install` to install dependencies
- Run `npm run ext` to build and zip the extension. 

The extension will load into any browser that supports Chrome's extenions API and manifest v3 (Chrome, Firefox, Edge, Opera, Vivaldi, etc.). DubPlus only uploads the extension to the Chrome WebStore and FireFox Add-ons. See https://dub.plus for more details

## Contributing

- Fork us    
- Create separate branch(es) to develop in
- Create a Pull Request targeting DubPlus's `develop` branch
- We will verify and test the changes before we merge it into our main branch

## Development

Requires Node v20 or higher
- install dependencies: `npm install`

The UI is written in [Svelte 5](https://svelte.dev/docs/svelte/overview) 

There are 2 ways you can develop.

### 1. Using the Mock queup.net

- run `npm run dev` and open the localhost:port that is printed in the command line by vite.
- start developing

This is a limited mockup of Queup.net so queup apis won't work. This environment is useful for quick development of UI related things.

### 2. Loading the unpacked extension in Chrome

- run `npm run build:watch`
- open [chrome://extensions/](chrome://extensions/)
- if you have the Dub+ extension installed from the Chrome WebStore, make sure to disable it
- Turn on the "developer mode" switch in the top right
- Click on "Load unpacked" button in the top left
- select the root folder of this repo
- Open a new tab and log in to https://queup.net and join a room
- start developing

**Note**: Every time you hit save in a file, you'll need to refresh the extension and refresh the page


### npm scripts

`npm run dev` - starts the Vite development server which loads the mock QueUp page and our extension, watches for file changes (css and js) and reloads

`npm run build` - creates production builds of the JS and CSS files

`npm run build:watch` - Starts file watcher that will rebuild dubplus.js and dubplus.css on save

`npm run ext` - shortcut that runs `npm run build` then `npm run zip`

`npm run zip` - creates the zip file of the extension

`npm run start:firefox` - starts an instance of firefox with our extension loaded so you can test it in Firefox

`npm test` - runs playwright tests (still in early development)

`npm run test:ui` - opens playwright's UI to help with test development

TODO:
- figure out a way to develop using `web-ext` in Firefox so we can remove the mock QueUp
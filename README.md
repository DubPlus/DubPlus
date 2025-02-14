# DubPlus
Dub+ - A Dubtrack.fm and QueUp.net script/extension for added features and customizations

## How to build the extension
- First make sure you have installed [Node](https://nodejs.org/) version 20 or higher
  - if you're using [`nvm`](https://github.com/nvm-sh/nvm), you can just run `nvm use` inside the root of the repo
- Run `npm install` to install dependencies
- Run `npm run ext` to build and zip the extension. 

The extension will load into any browser that supports Chrome's extenions API and manifest v3 (Chrome, Firefox, Edge, Opera, Vivaldi, etc.). DubPlus only uploads the extention to the Chrome WebStore and FireFox Add-ons. See https://dub.plus for more details

### Contributing

- Fork us    
- Create separate branch(es) to develop in
- Create a Pull Request targeting DubPlus's `develop` branch
- We will verify and test the changes before we merge it into our main branch

### Development

Requires Node v20 or higher
- install dependencies: `npm install`
- Run `npm run dev` to start the development server

The UI is written using [Svelte 5](https://svelte.dev/docs/svelte/overview) 

### npm tasks

`npm run dev` - starts the Vite development server which loads the mock QueUp page and our extension, watches for file changes (css and js) and reloads

`npm run build` - creates production builds of the JS and CSS files

`npm run ext` - builds the `extensions/Chrome` and `extensions/Firefox` folders.  **does not zip**

`npm run zip` - Zips the `extensions/Chrome` and `extensions/Firefox` folders

`npm run start:firefox` - starts an instance of firefox with our extension loaded so you can test it with Firefox

TODO:
- figure out a way to develop using `web-ext` in Firefox so we can remove the mock QueUp
# DubPlus
Dub+ - A Dubtrack.fm and QueUp.net script/extension for added features and customizations

## How to build the extension
- First make sure you have installed Node version 20 or higher
- The run `npm ci` to do a clean install of all dependencies
- run `npm run ext` to build and pack up the extension that will work in both Chrome and Firefox


### Contributing

- Fork us    
- Run `npm install` to install packages    
  - Requires Node 20+
- Create separate branch(es) to develop in.
  - only use your fork's `main` to create pull requests from 

### npm tasks

**NOTE:**
When building and/or minifying JS and Sass, the tasks inject the Rawgit url based on your Github User and branch name when not on the master branch or not using the '-release' tasks. If you're developing locally this is useful so you can point bookmarklets to your current feature dev branch.

`npm run dev` - starts the Vite development server which loads the mock QueUp page and our extension, watches for file changes (css and js) and reloads

`npm run build` - creates production builds of the JS and CSS files

`npm run ext` - builds the `extensions/Chrome` and `extensions/Firefox` folders.  **does not zip**

`npm run zip` - Zips the `extensions/Chrome` and `extensions/Firefox` folders

`npm run start:firefox` - starts an instance of firefox with our extension loaded so you can test it with Firefox

TODO:
- figure out a way to develop using `web-ext` in Firefox so we can remove the mock QueUp
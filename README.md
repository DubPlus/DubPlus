# DubPlus
Dub+ - A Dubtrack.fm and QueUp.net script/extension for added features and customizations

### Contributing

- Fork us    
- Run `npm install` to install packages    
- Create separate branch(es) to develop in.
  - only use your fork's `master` to create pull requests from 
- run `npm run build && npm run minify` in `master` before committing and submitting your pull request

The build script automatically is grabbing your Github Username and your current branch (when not in master) so that you're always pointing to your personal branch during developing & testing.  These variables are passed to both SASS files and JS files. But when you are in your own `master` branch it will hardcode those variables to the user `DubPlus`


### npm tasks

**NOTE:**
When building and/or minifying JS and Sass, the tasks inject the Rawgit url based on your Github User and branch name when not on the master branch or not using the '-release' tasks. If you're developing locally this is useful so you can point bookmarklets to your current feature dev branch.

`npm run dev` - starts the Vite development server which loads the mock QueUp page and our extension, watches for file changes (css and js) and reloads

`npm run build` - creates production builds of the JS and CSS files

`npm run ext` - builds the `extensions/Chrome` and `extensions/Firefox` folders.  **does not zip**, use `npm run zip` to zip.

`npm run zip` - Zips the `extensions/Chrome` and `extensions/Firefox` folders

`npm run ext-deploy` - first builds each extension, then zips them, then deploys each extensions to their respective online web stores

`npm run start:firefox` - starts an instance of firefox with our extension loaded so you can test it with Firefox

TODO:
- figure out a way to develop using `web-ext` in Firefox so we can remove the mock QueUp
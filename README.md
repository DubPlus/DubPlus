# DubPlus
Dub+ - A Dubtrack.fm script/extension for added features and customizations

### Contributing

- Fork us    
- Run `npm install` to install packages    
- Create separate branch(es) to develop in.
  - only use your fork's `master` to create pull requests from 
- run `npm run build` in `master` before committing and submitting your pull request

The build script automatically is grabbing your Github Username and your current branch (when not in master) so that you're always pointing to your personal branch during developing & testing.  These variables are passed to both SASS files and JS files. But when you are in your own `master` branch it will hardcode those variables to the user `DubPlus`


### npm tasks

**NOTE:**
When building and/or minifying JS and Sass, the tasks inject the Rawgit url based on your Github User and branch name when not on the master branch or not using the '-release' tasks. If you're developing locally this is useful so you can point bookmarklets to your current feature dev branch.

`npm run build` - Builds and minifies BOTH js and sass.

`npm run sass` - to compile only the sass files

`npm run ext` - takes the `extensions/common` folder and builds the `extensions/Chrome` and `extensions/Firefox` folders.  **does not zip**, use `npm run ext-zip` to zip.

`npm run ext-zip` - Zips the `extensions/Chrome` and `extensions/Firefox` folders

`npm start` - start watch mode which compiles both JS and Sass on each save
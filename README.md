# DubPlus
Dub+ - A Dubtrack.fm script/extension for added features and customizations

### Contributing

- Fork us    
- Run `npm install` to install packages    
- Create separate branch(es) to develop in.
  - only use your fork's `master` to create pull requests from 
- run `npm run build && npm run minify` in `master` before committing and submitting your pull request

The build script automatically is grabbing your Github Username and your current branch (when not in master) so that you're always pointing to your personal branch during developing & testing.  These variables are passed to both SASS files and JS files. But when you are in your own `master` branch it will hardcode those variables to the user `DubPlus`


### npm tasks

`npm run bundle` - runs babel and browserify on JS files

`npm run sass` - compiles sass files

`npm run build` - run both bundle & sass

`npm run minify` - produces minified files for both js and css files

`npm run watch` - starts JS and Sass file watching and compiling of each

`npm start` - same as running "watch"

`npm run ext` - takes the `extensions/common` folder and builds the `extensions/Chrome` and `extensions/Firefox` folders

`npm run ext-deploy` : first builds each extension, then zips them, then deploys each extensions to their respective online web stores
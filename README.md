# DubPlus
Dub+ - A Dubtrack.fm script/extension for added features and customizations

### Contributing

- Fork us    
- Run `npm install` to install packages    
- Create separate branch/branches to develop in    
- only use your fork's `master` to create pull requests from and remember to run `gulp` in `master` first before committing and submitting your pull request

Gulp automatically is grabbing your Github Username and your current branch (when not in master) so that you're always pointing to your personal branch during developing testing.  These variables are passed to both SASS files and JS files.  

in JS:    
See `src/js/lib/settings.js` for an example

in SASS:    
See `src/sass/variables.scss` 


But when you are in your own `master` branch it will hardcode those variables to the user `DubPlus`
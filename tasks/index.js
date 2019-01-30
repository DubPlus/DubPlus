/******************************************************************
 * custom tasks
 */

const log = require('./colored-console.js');
var jsTasks = require(process.cwd() + '/tasks/jsbundle.js');
var sassTasks = require(process.cwd() + '/tasks/sassbundle.js');
var extension = require(process.cwd() + '/tasks/extensions.js');

// find out which task we're running
var currentTask = process.argv[2]; 
var arg = process.argv[3];

function onError(err){
  log.error(err);
}

switch (currentTask) {
  case 'watch':
    jsTasks.watch();
    sassTasks.watch();
    break;

  // runs both bundling and minifying
  case 'bundle':
    jsTasks.bundle()
      .then(jsTasks.minify)
      .then(function(){ console.log('js bundling and minifying complete'); })
      .catch(onError);
    break;

  // separated out minifying just in case
  case 'min':
  case 'minify':
  case 'min-release':
    jsTasks.minify()
      .then(function(){ console.log('js minifying finished'); })
      .catch(onError);
    sassTasks.minify()
      .then(function(){ console.log('sass finished minifying');})
      .catch(onError);
    break;

  case 'sass':
    sassTasks.compile()
      .then(sassTasks.minify)
      .then(function(){ console.log('sass finished compiling & minifying');})
      .catch(onError);
    break;

  case 'ext':
    extension.build();
    break;

  case 'ext-zip':
    extensionBuild('zip');
    break;

  case 'ext-deploy':
    var deployExt = require(process.cwd() + '/tasks/deploy-ext.js');
    extensionBuild('zip');
    deployExt(arg);
    break;

  // default 'npm run default' task should be both bundle and minify JS and Sass files
  case 'build':
  case 'build-release':
  default:
    jsTasks.bundle()
      .then(jsTasks.minify)
      .then(function(){ console.log('js finished bundling and minifying'); })
      .catch(onError);
    sassTasks.compile()
      .then(sassTasks.minify)
      .then(function(){ console.log('sass finished compiling & minifying');})
      .catch(onError);
}
/******************************************************************
 * custom tasks
 */

const log = require('./colored-console.js');
var jsTasks = require(process.cwd() + '/tasks/jsbundle.js');
var sassTasks = require(process.cwd() + '/tasks/sassbundle.js');
var extensionBuild = require(process.cwd() + '/tasks/extensions.js');

// find out which task we're running
var currentTask = process.argv[2];
var arg = process.argv[3];

function onError(src, err) {
  log.error(src, err);
}

switch (currentTask) {
  case 'watch':
    jsTasks.watch();
    sassTasks.watch();
    break;

  // runs both bundling and minifying
  case 'bundle':
    jsTasks
      .bundle()
      .then(jsTasks.minify)
      .then(function () {
        console.log('js bundling and minifying complete');
      })
      .catch((err) => {
        onError('js bundle', err);
      });
    break;

  // separated out minifying just in case
  case 'min':
  case 'minify':
  case 'min-release':
    jsTasks
      .minify()
      .then(function () {
        console.log('js minifying finished');
      })
      .catch((err) => {
        onError('js minify', err);
      });
    sassTasks
      .minify()
      .then(function () {
        console.log('sass finished minifying');
      })
      .catch((err) => {
        onError('sass minify', err);
      });
    break;

  case 'sass':
    sassTasks
      .compile()
      .then(sassTasks.minify)
      .then(function () {
        console.log('sass finished compiling & minifying');
      })
      .catch((err) => {
        onError('sass compile and minify', err);
      });
    break;

  case 'ext':
    extensionBuild();
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
    jsTasks
      .bundle()
      .then(jsTasks.minify)
      .then(function () {
        console.log('js finished bundling and minifying');
      })
      .catch((err) => {
        onError('js compile and minify', err);
      });
    sassTasks
      .compile()
      .catch((err) => {
        console.log(err);
        onError('sass compile', err);
      })
      .then(sassTasks.minify)
      .then(function () {
        console.log('sass finished compiling & minifying');
      })
      .catch((err) => {
        onError('sass minify', err);
      });
}

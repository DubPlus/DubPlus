/******************************************************************
 * custom tasks
 */

var jsTasks = require(process.cwd() + '/tasks/jsbundle.js');
var sassTasks = require(process.cwd() + '/tasks/sassbundle.js');
var extensionBuild = require(process.cwd() + '/tasks/extensions.js');
var deployExt = require(process.cwd() + '/tasks/deploy-ext.js');

// find out which task we're running
var currentTask = process.argv[2]; 
var arg = process.argv[3];

switch (currentTask) {
  case 'watch':
    jsTasks.watch();
    sassTasks.watch();
    break;

  case 'bundle':
    jsTasks.bundle();
    break;

  case 'minify':
    jsTasks.minify();
    sassTasks.minify();
    break;

  case 'sass':
    sassTasks.compile();
    break;

  case 'ext':
    extensionBuild();
    break;

  case 'ext-zip':
    extensionBuild('zip');
    break;

  case 'ext-deploy':
    extensionBuild();
    deployExt(arg);
    break;

  default:
    jsTasks.bundle();
    sassTasks.compile();
}
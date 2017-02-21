/******************************************************************
 * custom tasks
 */

var bundjeJS = require(process.cwd() + '/tasks/jsbundle.js');
var compileSASS = require(process.cwd() + '/tasks/sassbundle.js');
var extensionBuild = require(process.cwd() + '/tasks/extensions.js');
var deployExt = require(process.cwd() + '/tasks/deploy-ext.js');

var tasks = {

  "watch" : function(){
    bundjeJS(true);
    compileSASS(true);
  },

  "bundle" : bundjeJS,

  "sass" : compileSASS,

  "ext" : extensionBuild,

  // run "ext" explicity first, it has an async method so I don't want to
  // include it as part of the deploy script
  "ext-deploy" : deployExt,

  "default" : function(){
    bundjeJS();
    compileSASS();
    extensionBuild();
  }
};

// find out which task we're running
var currentTask = process.argv[2] || "default";
// run task
tasks[currentTask]();
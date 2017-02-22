/******************************************************************
 * custom tasks
 */

var jsTasks = require(process.cwd() + '/tasks/jsbundle.js');
var compileSASS = require(process.cwd() + '/tasks/sassbundle.js');
var extensionBuild = require(process.cwd() + '/tasks/extensions.js');
var deployExt = require(process.cwd() + '/tasks/deploy-ext.js');

var tasks = {

  "watch" : function(){
    jsTasks.watch();
    compileSASS(true);
  },

  "bundle" : jsTasks.bundle,

  "minify" : function(){
    jsTasks.minify();
    // minify css output
  },

  "sass" : compileSASS,

  "ext" : extensionBuild,

  "ext-deploy" : function(){
    extensionBuild();
    deployExt();
  },

  "default" : function(){
    jsTasks.bundle();
    compileSASS();
    extensionBuild();
  }
};

// find out which task we're running
var currentTask = process.argv[2] || "default";
// run task
tasks[currentTask]();
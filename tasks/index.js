/******************************************************************
 * custom tasks
 */

var jsTasks = require(process.cwd() + '/tasks/jsbundle.js');
var sassTasks = require(process.cwd() + '/tasks/sassbundle.js');
var extensionBuild = require(process.cwd() + '/tasks/extensions.js');
var deployExt = require(process.cwd() + '/tasks/deploy-ext.js');

var arg = process.argv[3];

var tasks = {

  "watch" : function(){
    jsTasks.watch();
    sassTasks.watch();
  },

  "bundle" : jsTasks.bundle,

  "minify" : function(){
    jsTasks.minify();
    sassTasks.minify();
  },

  "sass" : sassTasks.compile,

  "ext" : extensionBuild,
  
  "ext-zip" : function(){
    extensionBuild('zip');
  },

  "ext-deploy" : function(){
    extensionBuild();
    deployExt(arg);
  },

  "default" : function(){
    this.bundle();
    this.sass();
  }
};

// find out which task we're running
var currentTask = process.argv[2] || "default";

// run task
// pass it a possible 3rd argument
tasks[currentTask](process.argv[3]);
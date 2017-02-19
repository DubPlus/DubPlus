/******************************************************************
 * custom tasks
 */

var bundjeJS = require('./tasks/jsbundle.js');
var compileSASS = require('./tasks/sassbundle.js');

var tasks = {

  "watch" : function(){
    bundjeJS(true);
    compileSASS(true);
  },

  "bundle" : bundjeJS,

  "sass" : compileSASS,

  "default" : function(){
    bundjeJS();
    compileSASS();
  },
};

// find out which task we're running
var currentTask = process.argv[2] || "default";
// run task
tasks[currentTask]();
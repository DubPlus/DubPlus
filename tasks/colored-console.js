// what can I say, I like fancy colors in my console ;-)
const chalk = require('chalk');
const boldRed = chalk.bold.red;
const yellow = chalk.yellow;
const green = chalk.green;

/***************************************************
  If you want plain white output, use console.log
  I created this module so that we could get some
  colors with other types of console outputs
*/

var emoji = {
  warn: "⚠️",
  x : "❌",
  exclamation: "❗️",
};

var log = {
  
  // show all console.error in bold red
  error : function(){
    var args = Array.from(arguments);
    var returnStr = '';
    args.forEach((e)=>{
      returnStr += boldRed(e) + ' ';
    });
    console.error(`${emoji.x}  ${returnStr}`);
  },

  // show all console.info in green
  info : function(){
    var args = Array.from(arguments);
    var returnStr = '';
    args.forEach((e)=>{
      returnStr += green(e) + ' ';
    });
    console.info(returnStr);
  },

  // console dir does NOT pretty print, so this will
  dir : function() {
    var args = Array.from(arguments);
    args.forEach((o)=>{
      console.log(JSON.stringify(o,null, 2));
    });
  },

  // show warn in yellow
  warn : function() {
    var args = Array.from(arguments);
    var returnStr = '';
    args.forEach((e)=>{
      returnStr += yellow(e) + ' ';
    });
    console.error(`${emoji.warn}  ${returnStr}`);
  }

};


// uncomment below and run this file directly to see examples:
// log.error('this is an error with a big X emoji before it');
// log.warn('this is a warning with','warning sign emoji before it');
// log.dir({'object': { 'that': 'will', 'pretty' : {'print': 1} }});
// log.info("info should be green");
// log.info("you","can", "still", "separate with commas", "and it will show on one line");
// process.exit(0);


module.exports = log;
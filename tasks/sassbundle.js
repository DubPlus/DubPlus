const fs = require('fs');
const path = require('path');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const prefixer = postcss([ autoprefixer ]);
const log = require('./colored-console.js');

// our own custom module
var gitInfo = require(process.cwd() + '/tasks/repoInfo.js');

// I added a way to override host so I can test locally
// but it means I need to run this task with node and not npm
var localFlag = typeof process.argv[3] !== "undefined" && (process.argv[3] === '-l' || process.argv[3] === '--local');
var host = process.argv[4];

/******************************************************************
 * Build SASS
 */

// in order to pass variables to SASS we use the "data" options in node-sass
// and pass that a SASS string with our variables first and an @import of
// our main SASS file right after

var resourceSrc = `https://raw.githubusercontent.com/${gitInfo.user}/DubPlus/${gitInfo.branch}`;
if (localFlag && host) {
  resourceSrc = host;
}
log.info(`* SASS $resourceSrc set to ${resourceSrc}`);
log.info('***************************************');

// first we define our variables
var dataString =  `$resourceSrc : "${resourceSrc}"; `;

var sassEntryFile = "./src/sass/dubplus";
// then we @import our main sass file
dataString += `@import '${sassEntryFile}';`;

function compileSASS() {
  return new Promise(function (resolve, reject){
    sass.render({
      data : dataString,
    }, function(err, result) { 
      if (err) { reject(err); }
      fs.writeFileSync('./css/dubplus.css', prefixer.process(result.css));
      resolve();
    });
  });
}

function minifySASS() {
  return new Promise(function (resolve, reject){
    sass.render({
      data : dataString,
      outputStyle : "compressed"
    }, function(err, result) { 
      if (err) { reject(err); }
      fs.writeFileSync('./css/dubplus.min.css', prefixer.process(result.css));
      resolve();
    });
  });
}

function watchingSASS() {
  // create our own sass file watch with node
  fs.watch('./src/sass',
    {
      recursive : true
    },
    function (event, filename) {
      if ( filename && /s[ca]ss/i.test(path.extname(filename)) ) {
        console.log(`SASS ${event} event detected`);
        console.log(`file: ${filename}`);
        compileSASS();
      } else {
        log.error('Filename missing. NOT compiling. Try again');
      }
    }
  );
}

module.exports = {
  compile : compileSASS,
  watch : watchingSASS,
  minify : minifySASS
};
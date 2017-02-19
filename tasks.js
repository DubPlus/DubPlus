var fs = require('fs');
var path = require('path');


// find out which task we're running
var task = process.argv[2];
if (!task) {
  task = "build"; // default task is build both JS and SASS
}

/******************************************************************
 * Get the current branch name to be passed as a variable
 * to JS and Sass builds
 */
var getRepoInfo = require('git-repo-info');
var info = getRepoInfo();
var CURRENT_BRANCH = info.branch;

/******************************************************************
 * Get the github user name so we can pass it as a variable to both
 * SASS and JS
 * github.com/DubPlus/DubPlus/branch
 *            ^^^^^^^ I want to get this 
 */
var CURRENT_REPO = 'DubPlus';  // default to our main repo

var sync = require('child_process').spawnSync;
var gitURL = sync('git', ['config', '--get', 'remote.origin.url'], {encoding : "UTF-8"});
var whichRepo = gitURL.stdout.split(":")[1].split("/")[0];
if (CURRENT_BRANCH !== 'master') {
  // github.com/CURRENT_DEVS_FORK/DubPlus/branch
  //            ^^^^^^^^^^^^^^^^^ switching it to your local
  CURRENT_REPO = whichRepo;
}


console.log('Current Github User is:', whichRepo);
console.log('Current branch is:', CURRENT_BRANCH);
/******************************************************************
 * Setup browserify with options
 */

var watchify    = require('watchify');
var babelify    = require("babelify");
var browserify  = require('browserify');

var options = {
  entries: ['./src/js/dubplus.js'],
  cache : {},
  packageCache : {},
  insertGlobalVars: { 
    // so that we can point to the proper branch during testing or production
    CURRENT_BRANCH: function () { return "'" + CURRENT_BRANCH + "'"; },
    // so that we can point to the proper repo during testing or production
    CURRENT_REPO: function () { return "'" + CURRENT_REPO + "'"; },
    // so that we can insert it as a cache busting query string for CSS
    TIME_STAMP : function() { return  "'" +  Date.now() + "'";}
  }
};

var b = browserify(options);
b.on('log', function (msg) { console.log(msg); });
b.on('error', function(err) { console.error(err); });
b.on('bundle', function () { 
  console.log("Browserify: bundling JS files");
});

function bundle() {
  b.transform(babelify, {presets: ["es2015"]})
    .bundle()
    .pipe(fs.createWriteStream('./dubplus.js', 'utf8'));
}


/******************************************************************
 * Build SASS
 * After build BRANCH is replaced with current branch name
 */

var sass = require('node-sass');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var prefixer = postcss([ autoprefixer ]);

// in order to pass variables to SASS we use the "data" options in node-sass
// and pass that a SASS string with our variables first and an @import of
// our main SASS file right after

// first we define our variables
var dataString =  "$build_branch : " + CURRENT_BRANCH + "; ";
    dataString += "$build_repo : " + CURRENT_REPO + "; ";

// then we @import our main sass file
    dataString += "@import '" + './src/sass/dubplus.scss' + "';";

function compileSASS() {
  sass.render({
    data : dataString,
  }, function(err, result) { 
    if (err) {return console.error(err); }
    fs.writeFileSync('./css/dubplus.css', prefixer.process(result.css));
  });
}

/******************************************************************
 * start appropriate task
 */

if (task === "watch") {

  // watch our JS with watchify plugin for browserify  
  b.plugin(watchify, {
    // no options to pass as this time
  });

  b.on('update', function(ids){
    console.log(ids);
    bundle();
  });

  // create our own sass file watch with node
  fs.watch('./src/sass',
    {
      recursive : true
    },
    function (event, filename) {
      if (event === "change" && filename && path.extname(filename) === ".scss") {
        console.log('SASS '+event+' event detected');
        console.log('file: '+ filename);
        compileSASS();
      } else {
        console.log(event +' event detected. NOT compiling.  Hit save again to compile');
      }
    }
  );

} else if (task === "bundle") {
  
  bundle();

} else if (task === "sass") {
  
  compileSASS();

} else {

  bundle();
  compileSASS();

}



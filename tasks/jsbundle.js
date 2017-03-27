const babelify    = require("babelify");
const browserify  = require('browserify');
const fs = require('fs');
const log = require('./colored-console.js');

// our own custom module
var gitInfo = require(process.cwd() + '/tasks/repoInfo.js');
var pkg = require(process.cwd() + '/package.json');

// only want to pass a few things from package
delete pkg.main;
delete pkg.scripts;
delete pkg.repository;
delete pkg.bugs;
delete pkg.devDependencies;

console.log(`JS:  _RESOURCE_SRC_ set to ${gitInfo.resourceSrc}`);

/******************************************************************
 * Setup browserify with options
 */
var options = {
  entries: ['./src/js/dubplus.js'],
  cache : {},
  packageCache : {},
  insertGlobalVars: { 
    // so that we can point to the proper branch during testing or production
    _RESOURCE_SRC_: function () { return "'" + gitInfo.resourceSrc + "'"; },
    // so that we can insert it as a cache busting query string for CSS
    TIME_STAMP : function() { return  "'" +  Date.now() + "'";},
    // pass our modified pkg info
    PKGINFO : function() { return  "'" +  JSON.stringify(pkg) + "'"; }
  }
};

var b = browserify(options);
b.on('log', function (msg) { console.log(msg); });

function bundle() {
  console.log('Bundling all JS files');

  var mainFile = fs.createWriteStream('./dubplus.js', 'utf8');

  b.transform(babelify, {presets: ["es2015"]})
    .bundle()
    .pipe(mainFile);

  return new Promise(function (resolve, reject){
    mainFile.on('finish', function(){
      resolve();
    });
    b.on('error', function(err) { reject(err); });
    mainFile.on('error', function(err){
      reject(err);
    });
  }); 
}

function makeMin() {
  console.log('Minifying all JS files');
  var minFile = fs.createWriteStream('./dubplus.min.js', 'utf8');

  b.transform(babelify, {presets: ["es2015", "babili"]})
    .bundle()
    .pipe(minFile);

  return new Promise(function (resolve, reject){
    minFile.on('finish', function(){
      resolve();
    });
    b.on('error', function(err) { reject(err); });
    minFile.on('error', function(err){
      reject(err);
    });
  }); 
}

function watching(){
  var watchify    = require('watchify');

  // watch our JS with watchify plugin for browserify  
  b.plugin(watchify, {
    // no options to pass as this time
  });

  b.on('update', function(ids){
    console.log(ids);
    bundle();
  });

  // start browserify in order for watchify plugin to begin watching
  bundle();
}

module.exports = {
  watch : watching,
  bundle : bundle,
  minify : makeMin
};
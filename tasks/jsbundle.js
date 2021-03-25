const babelify    = require("babelify");
const browserify  = require('browserify');
const fs = require('fs');

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

function setupB(shouldMin){
  var b = browserify(options);
  b.on('log', function (msg) { console.log(msg); });
  b.transform(babelify, {presets: ["@babel/preset-env"]});

  if (shouldMin)
    b.transform('uglifyify', { global: true  })

  return b;
}

function finalize(b, fileOut){
  var out = `./${fileOut}`;
  var mainFile = fs.createWriteStream(out, 'utf8');
  
  b.bundle().pipe(mainFile);
  
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

function bundle() {
  console.log('Bundling all JS files');
  var b = setupB(false);
  return finalize(b, 'dubplus.js');
}

function makeMin() {
  console.log('Minifying all JS files');
  var b = setupB(true);
  return finalize(b, 'dubplus.min.js');
}

function watching(){
  var watchify = require('watchify');
  var b = setupB(false);
  // watch our JS with watchify plugin for browserify  
  b.plugin(watchify, {});
  b.on('update', function(ids){
    console.log(ids);
    finalize(b, 'dubplus.js');
  });
  // start browserify in order for watchify plugin to begin watching
  finalize(b, 'dubplus.js');
}

module.exports = {
  watch : watching,
  bundle : bundle,
  minify : makeMin
};
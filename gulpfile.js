'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var preprocess = require('gulp-preprocess');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require("babelify");
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

/******************************************************************
 * Get the current branch name to be passed as a variable
 * to JS and Sass builds
 */
var getRepoInfo = require('git-repo-info');
var info = getRepoInfo();
var CURRENT_BRANCH = info.branch;

/******************************************************************
 * Get the repo name so we can pass it as a variable to both
 * SASS and JS
 */

// github.com/DubPlus/DubPlus/branch
//            ^^^^^^^ I want to get this 

var CURRENT_REPO = 'DubPlus';  // default to our main repo

var sync = require('child_process').spawnSync;
var gitURL = sync('git', ['config', '--get', 'remote.origin.url'], {encoding : "UTF-8"});
var whichRepo = gitURL.stdout.split(":")[1].split("/")[0];
console.log('Current Repo is:', whichRepo);

if (CURRENT_BRANCH !== 'master') {
  // github.com/CURRENT_DEVS_FORK/DubPlus/branch
  //            ^^^^^^^^^^^^^^^^^ switching it to your local
  CURRENT_REPO = whichRepo;
}


/******************************************************************
 * Build SASS
 * After build BRANCH is replaced with current branch name
 */
gulp.task('sass', function () {
  return gulp.src('src/sass/dubplus.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(preprocess({context: { BRANCH: CURRENT_BRANCH, REPO: CURRENT_REPO}}))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('css'));
});

/******************************************************************
 * Browserify to 'compile' JS modules into one file
 * using Babel to transpile ES6(ES2015) to ES5
 */
gulp.task('build', function() {
  var options = {
    insertGlobalVars: { 
      // so that we can point to the proper branch during testing or production
      CURRENT_BRANCH: function () { return "'" + CURRENT_BRANCH + "'"; },
      // so that we can point to the proper repo during testing or production
      CURRENT_REPO: function () { return "'" + CURRENT_REPO + "'"; },
      // so that we can insert it as a cache busting query string for CSS
      TIME_STAMP : function() { return  "'" +  Date.now() + "'";}
    }
  };
  
  return browserify('./src/js/dubplus.js', options)
    .transform(babelify, {presets: ["es2015"]})
    .bundle()
    .on('error', function(err) { console.error(err); this.emit('end'); })
    .pipe(source('dubplus.js'))
    .pipe(gulp.dest('./'));
});
 
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['build']);
});

gulp.task('default',['sass','build']);
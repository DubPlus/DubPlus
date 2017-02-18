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
var getGitBranchName = require('git-branch-name');
var path = require('path');
var dirPath = path.resolve(__dirname, './');

var CURRENT_BRANCH = 'master';

getGitBranchName(dirPath, function(err, branchName) {
  CURRENT_BRANCH = branchName;
});


/******************************************************************
 * Build SASS
 * After build BRANCH is replaced with current branch name
 */
gulp.task('sass', function () {
  return gulp.src('src/sass/dubplus.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(preprocess({context: { BRANCH: CURRENT_BRANCH}}))
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
      // insert the branch name as a module scoped variable
      CURRENT_BRANCH: function () { return "'" + CURRENT_BRANCH + "'"; },
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
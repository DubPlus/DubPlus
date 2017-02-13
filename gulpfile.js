'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var preprocess = require('gulp-preprocess');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


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
    .pipe(gulp.dest('css'));
});

/******************************************************************
 * Browserify to 'compile' JS modules into one file
 * 
 */
gulp.task('browserify', function() {
  return browserify('./src/js/dubplus.js', {
      // insert the branch name as a module scoped variable
      insertGlobalVars: { CURRENT_BRANCH: function () { return "'" + CURRENT_BRANCH + "'"; } }
    })
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('dubplus.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./'));
});
 
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['browserify']);
});

gulp.task('default',['sass','browserify']);
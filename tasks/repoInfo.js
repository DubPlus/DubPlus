var getRepoInfo = require('git-repo-info');
var sync = require('child_process').spawnSync;

/******************************************************************
 * Get the current branch name to be passed as a variable
 * to JS and Sass builds
 */
var info = getRepoInfo();
var CURRENT_BRANCH = info.branch;

/******************************************************************
 * Get the github user name so we can pass it as a variable to both
 * SASS and JS
 * github.com/DubPlus/DubPlus/branch
 *            ^^^^^^^ I want to get this 
 */
var CURRENT_REPO = 'DubPlus';  // default to our main repo's user

var gitURL = sync('git', ['config', '--get', 'remote.origin.url'], {encoding : "UTF-8"});
var whichRepo = gitURL.stdout.split(":")[1].split("/")[0];
if (CURRENT_BRANCH !== 'master') {
  // github.com/CURRENT_DEVS_FORK/DubPlus/branch
  //            ^^^^^^^^^^^^^^^^^ switching it to your local
  CURRENT_REPO = whichRepo;
}


// console.log('Current Github User is:', whichRepo);
// console.log('Current branch is:', CURRENT_BRANCH);

module.exports = {
  branch : CURRENT_BRANCH,
  user : whichRepo
};
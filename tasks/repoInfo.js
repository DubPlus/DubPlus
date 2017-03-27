const getRepoInfo = require('git-repo-info');
const sync = require('child_process').spawnSync;
const log = require('./colored-console.js');

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

var CURRENT_REPO;
if (CURRENT_BRANCH === 'master') {
  // if we're in master that means we're ready to send a PR to the
  // main repo and we should always be set to DubPlus/DubPlus
  CURRENT_REPO = 'DubPlus';
} else {
  var gitURL = sync('git', ['config', '--get', 'remote.origin.url'], {encoding : "UTF-8"});
  CURRENT_REPO = gitURL.stdout.split(":")[1].split("/")[0];
}

log.info('***************************************');
log.info(`* Current Github User is: ${CURRENT_REPO}`);
log.info(`* Current branch is: ${CURRENT_BRANCH}`);
log.info('***************************************');

module.exports = {
  branch : CURRENT_BRANCH,
  user : CURRENT_REPO
};
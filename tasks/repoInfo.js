const getRepoInfo = require('git-repo-info');
const chalk = require('chalk');
const yellow = chalk.yellow;
const sync = require('child_process').spawnSync;
const log = require('./colored-console.js');

/*
  --release
  add this to the END to force rawgit to point to DubPlus/DubPlus/master
  example: node ./tasks bundle --release
  
  --local URL
  add this flag to the END to use given URL during testing (like localhost)
  example: node ./tasks sass --local http://localhost:3001
 */

var args = process.argv;
var releaseFlag = args[args.length - 1] === '--release';
var localFlag = args[args.length - 2] === '--local';

/******************************************************************
 * Get the current branch name to be passed as a variable
 * to JS and Sass builds
 */
var info = getRepoInfo();
var CURRENT_BRANCH = info.branch;


var CURRENT_REPO;
if (CURRENT_BRANCH === 'master' || releaseFlag) {
  // if we're in master that means we're ready to send a PR to the
  // main repo and we should always be set to DubPlus/DubPlus
  CURRENT_BRANCH = 'master'; // just in case we got here via the releaseFlag
  CURRENT_REPO = 'DubPlus';
} else {
  /***************************************
   * Get the github user name 
   * github.com/DubPlus/DubPlus/branch
   *            ^^^^^^^ I want to get this 
   */
  var gitURL = sync('git', ['config', '--get', 'remote.origin.url'], {encoding : "UTF-8"});
  CURRENT_REPO = gitURL.stdout.split(":")[1].split("/")[0];
}


var resourceSrc = `https://cdn.jsdelivr.net/gh/${CURRENT_REPO}/DubPlus@${CURRENT_BRANCH}`;
if (localFlag) {
  resourceSrc = args[args.length - 1];
}

var payload = `//cdn.jsdelivr.net/gh/${CURRENT_REPO}/DubPlus@${CURRENT_BRANCH}/dist/dubplus.min.js`;
var jsBookmarklet = `javascript:var i,s=document.createElement('script');s.src="${payload}";document.body.appendChild(s);void(0);`;

log.info('****************************************************************');
console.log(`Current Github User is: ${yellow(CURRENT_REPO)}`);
console.log(`Current branch is: ${yellow(CURRENT_BRANCH)}`);
console.log(`Rawgit url: ${yellow(resourceSrc)}`);
console.log('You can create a bookmarklet for this build by copy/pasting this:');
console.log(yellow(jsBookmarklet));
log.info('****************************************************************');

module.exports = {
  branch : CURRENT_BRANCH,
  user : CURRENT_REPO,
  resourceSrc : resourceSrc
};
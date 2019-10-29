const getRepoInfo = require('git-repo-info');
const chalk = require('chalk');
const yellow = chalk.yellow;
const sync = require('child_process').spawnSync;
const log = require('./colored-console.js');

/*
  BUILD=release
  add this to the FRONT to force jsDelivr to point to DubPlus/DubPlus/master
  example: BUILD=release node ./tasks bundle
  
  BUILD=beta
  add this to the FRONT to force jsDelivr to point to DubPlus/DubPlus/beta
  example: BUILD=beta node ./tasks bundle
 */

var releaseFlag = process.env.BUILD === "release";
var betaFlag = process.env.BUILD === "beta";

/******************************************************************
 * Get the current branch name to be passed as a variable
 * to JS and Sass builds
 */
var info = getRepoInfo();
var CURRENT_BRANCH = info.branch;

var resourceSrc;
var CURRENT_REPO;
if (CURRENT_BRANCH === 'master' || releaseFlag) {
  // if we're in master that means we're ready to send a PR to the
  // main repo and we should always be set to DubPlus/DubPlus
  CURRENT_REPO = 'DubPlus';
  resourceSrc = 'https://dubplus.github.io/DubPlus';
} else if (CURRENT_BRANCH === 'beta' || betaFlag) {
  // DubPlus/DubPlus@beta
  CURRENT_REPO = 'DubPlus';
  resourceSrc = `https://cdn.jsdelivr.net/gh/${CURRENT_REPO}/DubPlus@beta`;
} else {
  /***************************************
   * Get the github user name 
   * github.com/DubPlus/DubPlus/branch
   *            ^^^^^^^ I want to get this 
   * 
   * TODO check if url starts with 'git' or 'http'
   */
  var gitURL = sync('git', ['config', '--get', 'remote.origin.url'], {encoding : "UTF-8"});
  CURRENT_REPO = gitURL.stdout.indexOf("git@") === 0
    ? gitURL.stdout.split(":")[1].split("/")[0]
    : gitURL.stdout.split("/")[gitURL.stdout.split("/").length - 2];
  resourceSrc = `https://cdn.jsdelivr.net/gh/${CURRENT_REPO}/DubPlus@${CURRENT_BRANCH}`;
}

// might need to switch to commit hashes so that we overcome jsDelivr's cache
// var dubplusCommitHash = sync('git', ['log','-n','1','--pretty=format:%H','--','dubplus.min.js'], {encoding : "UTF-8"}).stdout;
var payload = `${resourceSrc}/dubplus.min.js`;
var jsBookmarklet = `javascript:var d=document,s=d.createElement('script');s.src="${payload}";d.body.appendChild(s);void(0);`;

log.info('****************************************************************');
console.log(`Current Github User is: ${yellow(CURRENT_REPO)}`);
console.log(`Current branch is: ${yellow(CURRENT_BRANCH)}`);
console.log(`cdn url: ${yellow(resourceSrc)}`);
console.log('You can create a bookmarklet for this build by copy/pasting this:');
console.log(yellow(jsBookmarklet));
log.info('****************************************************************');

module.exports = {
  branch : CURRENT_BRANCH,
  user : CURRENT_REPO,
  resourceSrc : resourceSrc
};
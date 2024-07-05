import gitRepoInfo from 'git-repo-info';
import chalk from 'chalk';
import { spawnSync } from 'node:child_process';
import { log } from './colored-console.js';

const yellow = chalk.yellow;

/*
  --release
  add this to the END to force rawgit to point to DubPlus/DubPlus/master
  example: node ./tasks bundle --release
  
  --local URL
  add this flag to the END to use given URL during testing (like localhost)
  example: node ./tasks sass --local http://localhost:3001
 */

const args = process.argv;
const releaseFlag = args[args.length - 1] === '--release';
const localFlag = args[args.length - 2] === '--local';

let CURRENT_BRANCH = 'master';
let CURRENT_REPO = 'DubPlus';

/******************************************************************
 * Get the current branch name which will be used by JS and Sass builds
 */

// check if git exists on the machine
const gitExists = sync('git', ['--version'], { encoding: 'UTF-8' });
if (gitExists.stdout?.includes('git version')) {
  const info = getRepoInfo();
  CURRENT_BRANCH = info.branch;
  if (CURRENT_BRANCH !== 'master' && !releaseFlag) {
    /***************************************
     * Get the github user name
     * github.com/DubPlus/DubPlus/branch
     *            ^^^^^^^ I want to get this
     */

    const gitURL = sync('git', ['config', '--get', 'remote.origin.url'], {
      encoding: 'UTF-8',
    });
    if (gitURL?.stdout) {
      CURRENT_REPO = gitURL.stdout.split(':')[1].split('/')[0];
    }
  }
}

const resourceSrc = `https://cdn.jsdelivr.net/gh/${CURRENT_REPO}/DubPlus`;
if (localFlag) {
  resourceSrc = args[args.length - 1];
}

var jsBookmarklet = `javascript:var i,s,ss='//cdn.jsdelivr.net/gh/${CURRENT_REPO}/DubPlus/dubplus.js';s=document.createElement('script');s.src=ss;document.body.appendChild(s);}void(0);`;

log.info('****************************************************************');
console.log(
  'You can create a bookmarklet for this build by copy/pasting this:'
);
console.log(jsBookmarklet);
log.info('****************************************************************');

module.exports = {
  branch: CURRENT_BRANCH,
  user: CURRENT_REPO,
  resourceSrc: resourceSrc,
};

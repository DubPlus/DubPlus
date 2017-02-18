#!/bin/sh
# git hook to run a command after `git pull` or 'git merge'
# put it into `.git/hooks/` and give it chmod +x 

# What this does it replace the gitRoot in settings to the main master repo
# so that when it's merged in via a pull request the script points to the
# right place.  
# 
# when you're developing you should create a separate branch in your own fork
# only use your master to branch as a place to send pull requests

current_branch="$(git branch -l | grep "* ")"

MAINREPO="https://rawgit.com/DubPlus/DubPlus/"
function fixGitRoot() {
  sed -E -i '' "s,https://rawgit.com/[A-Za-z0-9]+/DubPlus/,${1},g" src/js/lib/settings.js
}

echo "Currently in branch: ${current_branch}"

if [[ $current_branch == *"master"* ]]; then
  echo "changing gitRoot to: ${MAINREPO}"
  fixGitRoot $MAINREPO
  echo "Running Gulp"
  gulp
fi
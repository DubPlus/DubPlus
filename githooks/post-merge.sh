#!/bin/sh
# git hook to run a command after `git pull` or 'git merge'
# put it into `.git/hooks/` and give it chmod +x 

# Always run gulp after merging into master


current_branch="$(git branch -l | grep "* ")"

echo "Currently in branch: ${current_branch}"

if [[ $current_branch == *"master"* ]]; then
  echo "Running Gulp after merge into master branch"
  gulp
fi
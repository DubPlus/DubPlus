#!/bin/sh
# git hook to run a command after `git pull`
# checks if in specific branch and makes a change
# put it into `.git/hooks/`.

current_branch="$(git branch -l | grep "* " | sed -E "s,\* *,,")"

echo "Currently in branch: ${current_branch}"

# we always want to run gulp sass when merging into master
if [[ $current_branch == *"master"* ]]; then
  echo "running gulp after merging into master"
  gulp
fi
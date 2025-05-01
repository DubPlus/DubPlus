import { execSync } from 'child_process';

export function getCurrentBranch() {
  // GITHUB_BASE_REF = target branch of a pull request
  // GITHUB_HEAD_REF = source branch of a pull request

  // if this is being called from a github action triggered by a pull request,
  // then we can just grab the branch name from github's environment variables.
  // in this case we always want the target branch. Unless it's the main branch,
  // then we should return an empty string.
  if (process.env.GITHUB_BASE_REF) {
    return process.env.GITHUB_BASE_REF === 'master' ||
      process.env.GITHUB_BASE_REF === 'main'
      ? ''
      : process.env.GITHUB_BASE_REF;
  }
  try {
    return execSync('git symbolic-ref HEAD 2>/dev/null')
      .toString()
      .trim()
      .replace('refs/heads/', '');
  } catch (e) {
    console.warn(
      "Couldn't get the current branch name. This is likely because this is not being run in a git repository.",
      e.message,
    );
    return '';
  }
}

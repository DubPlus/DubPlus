import { execSync } from 'child_process';

// In a github action the following environment variables are set:
// GITHUB_BASE_REF = target branch of a pull request
// GITHUB_HEAD_REF = source branch of a pull request

export function branchName() {
  return (
    process.env.GITHUB_BASE_REF ||
    execSync('git symbolic-ref HEAD 2>/dev/null')
      .toString()
      .trim()
      .replace('refs/heads/', '')
  );
}

export function getCurrentBranch() {
  try {
    const name = branchName();
    return name;
  } catch {
    return '';
  }
}

import { execSync } from 'child_process';

// git symbolic-ref HEAD 2>/dev/null

export function getCurrentBranch() {
  try {
    return execSync('git symbolic-ref HEAD 2>/dev/null')
      .toString()
      .trim()
      .replace('refs/heads/', '');
  } catch (error) {
    return '';
  }
}

import chrome_ext from './deploy-chrome.js';
import { signFFext } from './deploy-ff.js';
import { doZip } from './zip.js';

function capFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function deployExtensions(platform) {
  // if specific platform wasn't provided then we do both
  if (!platform) {
    doZip('Chrome');
    doZip('Firefox');
    chrome_ext();
    ff_ext();
    return;
  }

  // format our platform string just in case
  var target = capFirst(platform);

  if (target === 'Chrome') {
    doZip('Chrome');
    chrome_ext();
    return;
  }

  if (target === 'Firefox') {
    doZip('Firefox');
    signFFext();
    return;
  }
}

import { execSync } from 'node:child_process';

/**
 * zips up folders for deployment to chrome/FF extentions stores
 * @param  {String} dir directory to zip up
 * @return {undefined}
 */
export function doZip(dir) {
  var options = {
    cwd: process.cwd() + '/extensions',
    stdio: 'inherit',
  };
  // zip [options] zipfile files-to-zip
  // file extension '.zip' assumed, leave it out
  execSync(
    `cd ${dir}; zip -vr ../DubPlus-${dir}-Extension * -x "*.DS_Store"`,
    options
  );
}

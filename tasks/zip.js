const execSync = require('child_process').execSync;

/**
 * zips up folders for deployment to chrome/FF extentions stores
 * @param  {String} dir directory to zip up
 * @return {undefined}
 */
module.exports = function doZip(dir){
  const extDir = process.cwd() + '/extensions';
  console.log(`${extDir}/${dir}`);
  
  var options = {
    stdio:'inherit'
  };
  // zip [options] zipfile files-to-zip
  // file extension '.zip' assumed, leave it out
  execSync(`zip -vr -b ${extDir}/${dir} DubPlus-${dir}-Extension * -x "*.DS_Store"`, options);
};
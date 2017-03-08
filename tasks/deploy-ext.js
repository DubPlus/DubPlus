var execSync = require('child_process').execSync;
var chrome_ext = require('./deploy-chrome.js');

/**
 * zips up folders for deployment to chrome/FF extentions stores
 * @param  {String} dir directory to zip up
 * @return {undefined}
 */
function doZip(dir){
  var options = {
    cwd: process.cwd() + `/extensions`,
    stdio:[0,1,2]
  };
  //zip [options] zipfile.zip files-to-zip
  execSync(`zip -vr ${dir} ${dir} -x "*.DS_Store"`,options);
}


module.exports = function(platform){

  // step 1, zip up both folders:
  ['Chrome','Firefox'].forEach(function(dir){
    doZip(dir);
  });

  // step 2
  
};


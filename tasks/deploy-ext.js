var execSync = require('child_process').execSync;
var chrome_ext = require('./deploy-chrome.js');
var ff_ext = require('./deploy-ff.js');

/**
 * zips up folders for deployment to chrome/FF extentions stores
 * @param  {String} dir directory to zip up
 * @return {undefined}
 */
function doZip(dir){
  var options = {
    cwd: process.cwd() + `/extensions`,
    stdio:'inherit'
  };
  // zip [options] zipfile files-to-zip
  // file extension '.zip' assumed, leave it out
  execSync(`cd ${dir}; zip -vr ../DubPlus-${dir}-Extension * -x "*.DS_Store"`,options);
}

function capFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = function(platform){
  // format our platform string just in case
  var target = capFirst(platform);

  if (target === "Both") {
    doZip("Chrome");
    doZip("Firefox");
    chrome_ext();
    ff_ext();
    return;
  }

  // do individual extension stuff
  doZip(target);
  
  // no deploy!
  if (target === "Chrome") {
    chrome_ext();
    return;
  }

  if (target === "Firefox") {
    ff_ext();
    return;
  }


};


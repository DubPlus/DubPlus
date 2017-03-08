var exec = require('child_process').exec;
var chrome_ext = require('./deploy-chrome.js');

/**
 * zips up folders for deployment to chrome/FF extentions stores
 * @param  {String} dir directory to zip up
 * @return {undefined}
 */
function doZip(dir){
  console.log(process.cwd() + `/extensions/${dir}`);
  //zip [options] zipfile.zip files-to-zip
  exec(`zip -vr ${dir} ${dir} -x "*.DS_Store"`,
    {cwd: process.cwd() + `/extensions`},
    function(error, stdout, stderr){
      //console.log('stdout: ' + stdout);
      if (stderr !== "") {
        console.log('stderr: ' + stderr);
      }
      if (error !== null) {
        console.log('exec error: ' + error);
      }
  });
}

module.exports = function(){
  
  // step 1, zip up both folders:
  ['Chrome','Firefox'].forEach(function(dir){
    doZip(dir);
  });

  // step 2
  
};


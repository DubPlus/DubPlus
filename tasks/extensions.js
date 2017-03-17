/***********************************************
 * This is a task to cross-build our extensions
 * from 'one' common source code
 */

const fs = require('fs-extra');
const execSync = require('child_process').execSync;
var pkg = require(process.cwd() + '/package.json');
const extPath = process.cwd() + "/extensions";

function rmCommonManifests() {
  ['Chrome','Firefox'].forEach(function(dir){
    fs.removeSync(`${extPath}/${dir}/manifest.core.json`);
    fs.removeSync(`${extPath}/${dir}/manifest.chrome.json`);
    fs.removeSync(`${extPath}/${dir}/manifest.firefox.json`);
  });
}

function copyCommonStatic(){
  ['Chrome','Firefox'].forEach(function(dir){
    fs.copySync(
      `${extPath}/common`,
      `${extPath}/${dir}`
    );
  });
}

function parseJSONfile(filename) {
  var jsonfile = extPath + "/common/"+ filename;
  var obj = {};

  try {
    obj = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
  } catch (e) {
    console.log ("Error in file: " + jsonfile);
    console.log(e + "\n");
  }

  return obj;
}

function combine(obj1, obj2, dest) {
  var finalObj = Object.assign({}, obj1, obj2);
  var fileContents = JSON.stringify(finalObj, null, 2);
  fs.writeFileSync(extPath + "/"+ dest + "/manifest.json", fileContents);
}

function copyScript() {
  ['Chrome','Firefox'].forEach(function(dir){
    fs.copySync('./dubplus.js', `${extPath}/${dir}/scripts/dubplus.js`);
    fs.copySync('./dubplus.min.js', `${extPath}/${dir}/scripts/dubplus.min.js`);
  });
}

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
  //  zip [options] zipfile files-to-zip
  // file extension '.zip' assumed, leave it out
  execSync(`cd ${dir}; zip -vr ../DubPlus-${dir}-Extension * -x "*.DS_Store"`,options);
}

module.exports = function(shouldZip) {
  /***********************************************
   * Create our Chrome and Firefox folders if they
   * don't exist already
   */
  [ 'Chrome','Firefox'].forEach(function(dir){
    fs.ensureDirSync(`${extPath}/${dir}`);
  });

  /**********************************************
   * First, copy static files from common into
   * both the Chrome and Firefox folder
   */

  console.log('Copying /common to /Chrome and /Firefox)');
  copyCommonStatic();

  /**********************************************
   * Make Manifest.json for each browser
   */

  console.log("Parsing manifest files and building to appropriate folder");
  var mCore = parseJSONfile("manifest.core.json");
  var mChrome = parseJSONfile("manifest.chrome.json");
  var mFF = parseJSONfile("manifest.firefox.json");

  // set version number from package.json
  mCore.version = pkg.version;

  // combine and export manifest files
  combine(mCore, mChrome, "Chrome");
  combine(mCore, mFF, "Firefox");

  // remove the common manifests from each folder
  rmCommonManifests();

  // just in case, copy the Dubplus script to each extension folder
  copyScript();

  if (shouldZip) {
    doZip("Chrome");
    doZip("Firefox");
  }
};
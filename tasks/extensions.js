/***********************************************
 * This is a task to cross-build our extensions
 * from 'one' common source code
 */

const fs = require('fs-extra');

const extPath = process.cwd() + "/extensions";

/***********************************************
 * Create our Chrome and Firefox folders if they
 * don't exist already
 */
[ 'Chrome','Firefox'].forEach(function(dir){
  fs.ensureDirSync(`${extPath}/${dir}`, function (err) {
    if (err) { return console.error(err); }
  });
});


function copyCommonStatic(what) {
  ['Chrome','Firefox'].forEach(function(dir){
    fs.copy(
      `${extPath}/common/${what}`,
      `${extPath}/${dir}/${what}`,
      function (err) {
        if (err) { return console.error(err); }
        console.log(`Success copying ${what} to ${dir} folder`);
      }
    );
  });
}

/**********************************************
 * First, copy static files from common into
 * both the Chrome and Firefox folder
 */

console.log('Copying subfolders to each build destination (/Chrome and /Firefox)');
copyCommonStatic('icons');
copyCommonStatic('scripts');

/**********************************************
 * Make Manifest.json for each browser
 */

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
  var finalObj = Object.assign(obj1, obj2);
  var fileContents = JSON.stringify(finalObj, null, 2);
  fs.writeFileSync(extPath + "/"+ dest + "/manifest.json", fileContents);
}

console.log("Parsing manifest files and building to appropriate folder");
var mCore = parseJSONfile("manifest.core.json");
var mChrome = parseJSONfile("manifest.chrome.json");
var mFF = parseJSONfile("manifest.firefox.json");
combine(mCore, mChrome, "Chrome");
combine(mCore, mFF, "Firefox");
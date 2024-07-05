/***********************************************
 * This is a task to cross-build our extensions
 * from 'one' common source code
 */
import fs from 'node:fs';
import { doZip } from './zip.js';
import { log } from './colored-console.js';
import pkg from '../package.json';

const extPath = process.cwd() + '/extensions';

/**
 *
 * @param {string} dir
 */
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function rmCommonManifests() {
  ['Chrome', 'Firefox'].forEach(function (dir) {
    fs.unlinkSync(`${extPath}/${dir}/manifest.core.json`);
    fs.unlinkSync(`${extPath}/${dir}/manifest.chrome.json`);
    fs.unlinkSync(`${extPath}/${dir}/manifest.firefox.json`);
  });
}

function copyCommonStatic() {
  ['Chrome', 'Firefox'].forEach(function (dir) {
    fs.cpSync(`${extPath}/common`, `${extPath}/${dir}`, {
      recursive: true,
      force: true,
    });
  });
}

function parseJSONfile(filename) {
  var jsonfile = extPath + '/common/' + filename;
  var obj = {};

  try {
    obj = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
  } catch (e) {
    log.error('Error in file: ' + jsonfile);
    log.dir(e + '\n');
  }

  return obj;
}

function combine(obj1, obj2, dest) {
  const finalObj = Object.assign({}, obj1, obj2);
  const fileContents = JSON.stringify(finalObj, null, 2);
  fs.writeFileSync(
    extPath + '/' + dest + '/manifest.json',
    fileContents,
    'utf8'
  );
}

function copyScript() {
  ['Chrome', 'Firefox'].forEach(function (dir) {
    fs.copyFileSync(
      process.cwd() + '/dubplus.js',
      `${extPath}/${dir}/scripts/dubplus.js`
    );
    fs.copyFileSync(
      process.cwd() + '/dubplus.min.js',
      `${extPath}/${dir}/scripts/dubplus.min.js`
    );
  });
}

function replaceVersionInScript() {
  ['Chrome', 'Firefox'].forEach(function (dir) {
    // load the 'scripts/loader.js' file
    const loaderScript = fs.readFileSync(
      `${extPath}/${dir}/scripts/loader.js`,
      'utf8'
    );
    // replace the version number with the current version
    const newLoaderScript = loaderScript.replace(
      /VERSION_REPLACED_BY_BUILD_SCRIPT/g,
      pkg.version
    );
    // write the file back
    fs.writeFileSync(
      `${extPath}/${dir}/scripts/loader.js`,
      newLoaderScript,
      'utf8'
    );
  });
}

export function packExtensions(shouldZip = false) {
  /***********************************************
   * clear out the Chrome and Firefox folders
   */
  ['Chrome', 'Firefox'].forEach(function (dir) {
    fs.rmSync(`${extPath}/${dir}`, { recursive: true, force: true });
  });

  /***********************************************
   * re-create our Chrome and Firefox folders
   */
  ['Chrome', 'Firefox'].forEach(function (dir) {
    fs.mkdirSync(`${extPath}/${dir}`, { recursive: true });
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

  console.log('Parsing manifest files and building to appropriate folder');
  const mCore = parseJSONfile('manifest.core.json');
  const mChrome = parseJSONfile('manifest.chrome.json');
  const mFF = parseJSONfile('manifest.firefox.json');

  // set version number from package.json
  mCore.version = pkg.version;

  // combine and export manifest files
  combine(mCore, mChrome, 'Chrome');
  combine(mCore, mFF, 'Firefox');

  // remove the common manifests from each folder
  rmCommonManifests();

  // just in case, copy the Dubplus script to each extension folder
  copyScript();

  replaceVersionInScript();

  if (shouldZip) {
    doZip('Chrome');
    doZip('Firefox');
  }
}

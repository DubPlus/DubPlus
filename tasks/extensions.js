/***********************************************
 * This is a task to cross-build our extensions
 * from 'one' common source code
 */
import fs from 'node:fs';
import { log } from './fancy-log.js';
import pkg from '../package.json' with { type: "json" };
import manifest from '../extensions/common/manifest.json' with { type: 'json' };

const extPath = process.cwd() + '/extensions';

const BROWSERS = ['Chrome', 'Firefox'];

/**
 *
 * @param {string} dir
 */
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyCommonStatic() {
  BROWSERS.forEach(function (dir) {
    fs.cpSync(`${extPath}/common`, `${extPath}/${dir}`, {
      recursive: true,
      force: true,
    });
  });
}

function copyScripts() {
  BROWSERS.forEach(function (dir) {
    fs.copyFileSync(
      process.cwd() + '/dubplus.js',
      `${extPath}/${dir}/scripts/dubplus.js`
    );
    fs.copyFileSync(
      process.cwd() + '/dubplus.css',
      `${extPath}/${dir}/css/dubplus.css`
    );
  });
}

export function packExtensions() {
  /***********************************************
   * clear out the Chrome and Firefox folders
   */
  BROWSERS.forEach(function (dir) {
    fs.rmSync(`${extPath}/${dir}`, { recursive: true, force: true });
  });

  /***********************************************
   * re-create new Chrome and Firefox folders
   */
  BROWSERS.forEach(function (dir) {
    fs.mkdirSync(`${extPath}/${dir}`);
    // also make the scripts folder
    fs.mkdirSync(`${extPath}/${dir}/scripts`);
    // and css folder
    fs.mkdirSync(`${extPath}/${dir}/css`);
  });

  /***********************************************
   * copy source files to Chrome and Firefox
   * Add-on/Extension reviewers need to be able to
   * inspect the source code, so we need to include
   * it in the final package. They also need to be
   * able to build the extension from source.
   */
  // BROWSERS.forEach(function (dir) {
  //   fs.mkdirSync(`${extPath}/${dir}`, { recursive: true });
  // });

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
  
  // set version number from package.json
  manifest.version = pkg.version;

  // just in case, copy the Dubplus script to each extension folder
  copyScript();
}

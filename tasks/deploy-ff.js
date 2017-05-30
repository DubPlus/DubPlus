const spawnSync = require('child_process').spawnSync;
const log = require('./colored-console.js');

/****************************************************
 * Important note
 * web-ext needs to be installed GLOBALLY
 * npm i web-ext -g
 *
 * more info on web-ext sign
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign
 *
 * this needs API keys i think
 */

function signFFext(){
  var options = {
    cwd: process.cwd() + `/extensions/Firefox`,
    encoding : 'utf8'
  };


  var webext = spawnSync('web-ext', ['sign'], options);
  var output = webext.stdout;

  var successResponse = "Your add-on has been submitted for review. It passed validation but could not be automatically signed because this is a listed add-on";

  if (output.indexOf(successResponse) > 0) {
    log.info('success');
  }
}

module.exports = signFFext;
const log = require('./colored-console.js');
import webExt from 'web-ext';

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

function signFFext() {
  const options = {
    cwd: process.cwd() + `/extensions/Firefox`,
    encoding: 'utf8',
  };
  webExt.cmd.sign(options).then((result) => {
    log.info('Firefox extension signed');
    console.log(result);
  });
}

module.exports = signFFext;

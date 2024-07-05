import webExt from 'web-ext';
import { log } from './colored-console';

/****************************************************
 * our ff addon link: https://addons.mozilla.org/en-US/firefox/addon/dubplus/
 *
 * more info on web-ext sign
 * https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign
 *
 * This command:
 *
 * - creates a listing for your extension on AMO if --channel is set to listed and the extension isn't listed.
 * - adds a version to a listed extension if the --channel is set to listed and your extension is listed.
 * - downloads a signed copy of the extension if the --channel is set to unlisted.
 */

export function signFFext() {
  const options = {
    apiKey: process.env.WEB_EXT_API_KEY,
    apiSecret: process.env.WEB_EXT_API_SECRET,
    channel: 'listed',
    timeout: 5 * 1000 * 60, // 5 minutes,
    uploadSourceCode: process.cwd() + '/extensions/Firefox',
  };
  webExt.cmd.sign(options).then((result) => {
    log.info('Firefox extension signed');
    console.log(result);
  });
}

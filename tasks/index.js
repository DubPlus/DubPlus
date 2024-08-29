/******************************************************************
 * custom tasks
 */
import { log } from './colored-console.js';
import { packExtensions } from './extensions.js';
import { doZip } from './zip.js';

// find out which task we're running
const currentTask = process.argv[2];
const arg = process.argv[3];

switch (currentTask) {
  case 'ext':
    packExtensions();
    break;

  case 'zip':
    // this does not build the extensions, it just zips them up
    doZip('Chrome');
    doZip('Firefox');
    break;

  // TODO: this is outdated and needs to be fixed.
  // case 'ext-deploy':
  //   packExtensions(true);
  //   deployExtensions(arg);
  //   break;

  default:
    log.error(`unknown task: ${currentTask} - exiting...`);
    break;
}

/******************************************************************
 * custom tasks
 */
import { log } from './colored-console.js';
import { packExtensions } from './extensions.js';
import { deployExtensions } from './deploy-ext.js';

// find out which task we're running
const currentTask = process.argv[2];
const arg = process.argv[3];

switch (currentTask) {
  case 'ext':
    packExtensions();
    break;

  case 'zip':
    packExtensions(true);
    break;

  case 'ext-deploy':
    packExtensions(true);
    deployExtensions(arg);
    break;

  default:
    log.error(`unknown task: ${currentTask} - exiting...`);
    break;
}

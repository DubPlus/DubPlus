import { autovote } from './autovote';
import { afk } from './afk';
// import { emotes } from './emotes';
// import { autocomplete } from './autocomplete';
// import { customMentions } from './customMentions';
// import { chatCleaner } from './chatCleaner';
// import { mentionNotifications } from './mentionNotifications';
// import { pmNotifications } from './pmNotifications';
// import { djNotification } from './djNotification';
// import { showDubsOnHover } from './showDubsOnHover';
import { snow } from './snow';
import { rain } from './rain';
import { fullscreen } from './fullscreen';
import { splitChat } from './splitchat';
import { hideVideo } from './hideVideo';
import { hideAvatars } from './hideAvatars';
import { hideBackground } from './hideBackground';
import { spacebarMute } from './spacebarMute';
import { warnOnNavigation } from './warnOnNavigation';
import { communityTheme } from './communityTheme';
import { customCss } from './customCSS';
import { customBackground } from './customBackground';
import { customNotificationSound } from './customNotificationSound';
import { flipInterface } from './flipInterface';
import { autoAfk } from './auto-afk';
// import { grabResponse } from './grabResponse';
import { collapsibleImages } from './collapsible-images';
import { pinMenu } from './pin-menu';

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const general = [
  autovote,
  afk,
  autoAfk,
  // emotes,
  // autocomplete,
  // customMentions,
  // chatCleaner,
  collapsibleImages,
  // mentionNotifications,
  // pmNotifications,
  // djNotification,
  // showDubsOnHover,
  // grabResponse,
  snow,
  rain,
];

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const userInterface = [
  fullscreen,
  splitChat,
  hideVideo,
  hideAvatars,
  hideBackground,
  flipInterface,
  pinMenu,
];

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const settingsModules = [spacebarMute, warnOnNavigation];

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const customize = [
  communityTheme,
  customCss,
  customBackground,
  customNotificationSound,
];

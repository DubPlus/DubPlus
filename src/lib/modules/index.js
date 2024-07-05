import { autovote } from './autovote';
import { afk } from './afk';
import { emotes } from './emotes';
import { autocomplete } from './autocomplete';
import { customMentions } from './customMentions';
import { chatCleaner } from './chatCleaner';
import { mentionNotifications } from './mentionNotifications';
import { pmNotifications } from './pmNotifications';
import { djNotification } from './djNotification';
import { showDubsOnHover } from './showDubsOnHover';
import { downdubsInChat } from './downDubInChat';
import { upDubInChat } from './upDubInChat';
import { grabsInChat } from './grabsInChat';
import { snow } from './snow';
import { rain } from './rain';
import { fullscreen } from './fullscreen';
import { splitChat } from './splitchat';
import { hideChat } from './hideChat';
import { hideVideo } from './hideVideo';
import { hideAvatars } from './hideAvatars';
import { hideBackground } from './hideBackground';
import { showTimestamps } from './showTimestamps';
import { spacebarMute } from './spacebarMute';
import { warnOnNavigation } from './warnOnNavigation';
import { communityTheme } from './communityTheme';
import { customCss } from './customCSS';
import { customBackground } from './customBackground';
import { customNotificationSound } from './customNotificationSound';

window.dubplus = window.dubplus || {};

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const general = [
  autovote,
  afk,
  emotes,
  autocomplete,
  customMentions,
  chatCleaner,
  mentionNotifications,
  pmNotifications,
  djNotification,
  showDubsOnHover,
  downdubsInChat,
  upDubInChat,
  grabsInChat,
  snow,
  rain,
];

general.forEach((module) => {
  window.dubplus[module.id] = module;
});

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const userInterface = [
  fullscreen,
  splitChat,
  hideChat,
  hideVideo,
  hideAvatars,
  hideBackground,
  showTimestamps,
];

userInterface.forEach((module) => {
  window.dubplus[module.id] = module;
});

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const settings = [spacebarMute, warnOnNavigation];

settings.forEach((module) => {
  window.dubplus[module.id] = module;
});

/**
 * @type {import("./module").DubPlusModule[]}
 */
export const customize = [
  communityTheme,
  customCss,
  customBackground,
  customNotificationSound,
];

customize.forEach((module) => {
  window.dubplus[module.id] = module;
});

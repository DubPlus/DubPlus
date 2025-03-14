import { logError, logInfo } from '../../utils/logger';
import { style } from '../../utils/css';
/**
 * Community Theme
 * Toggle Community CSS theme
 *
 * In order to use this feature the mods of the room need to add a link to the
 * css in the room description. The link should be formatted as follows:
 *
 * @dub+=https://example.com/style.css
 * or
 * @dubplus=https://example.com/style.css
 *
 * for backwards compatibility with dubx we're also checking
 * @dubx=https://example.com/style.css
 */

const LINK_ELEM_ID = 'dubplus-community-css';

/**
 * @type {import("./module").DubPlusModule}
 */
export const communityTheme = {
  id: 'community-theme',
  label: 'community-theme.label',
  description: 'community-theme.description',
  category: 'customize',
  turnOn() {
    const location = window.QueUp.room.model.get('roomUrl');
    fetch(`https://api.queup.net/room/${location}`)
      .then((response) => response.json())
      .then((e) => {
        const content = e.data.description;

        // for backwards compatibility with dubx we're checking for:
        // @dubx, @dubplus, and @dub+
        const themeCheck = new RegExp(
          /(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/,
          'i',
        );
        let community = null;
        content.replace(themeCheck, function (match, p1, p2, p3) {
          community = p3;
        });

        if (!community) {
          logInfo('No community CSS theme found');
          return;
        }
        logInfo('loading community css theme from:', community);
        return style(community, LINK_ELEM_ID);
      })
      .catch((error) => {
        logError('Community CSS: Failed to load room info', error);
      });
  },
  turnOff() {
    document.getElementById(LINK_ELEM_ID)?.remove();
  },
};

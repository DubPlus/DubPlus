import { logError, logInfo } from '../../utils/logger';
import { loadExternalCss } from '../../utils/css';
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

        // for backwards compatibility with dubx we're checking for both @dubx and @dubplus and @dub+
        const themeCheck = new RegExp(
          /(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/,
          'i',
        );
        let communityCSSUrl = null;
        content.replace(themeCheck, function (match, p1, p2, p3) {
          communityCSSUrl = p3;
        });

        if (!communityCSSUrl) {
          logInfo('No community CSS theme found');
          return;
        }
        logInfo('loading community css theme:', communityCSSUrl);
        loadExternalCss(communityCSSUrl, this.id);
      })
      .catch((error) => {
        logError('Community CSS: Failed to load room info', error);
      });
  },
  turnOff() {
    document.querySelector(`.${this.id}`)?.remove();
  },
};

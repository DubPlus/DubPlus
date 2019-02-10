/**
 * Class wrapper for Google Analytics
 */

// shim just in case blocked by an adblocker or something
const ga = window.ga || function(){};

class GA {
  constructor(uid){
    ga('create', uid, 'auto', 'dubplusTracker');
  }

  // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  event(eventCategory, eventAction, eventLabel, eventValue){
    ga('dubplusTracker.send', 'event', eventCategory, eventAction, eventLabel, eventValue)
  }

  /**
   * Use this method to track clicking on a menu item
   * @param {String} menuSection The menu section's title will be used for the event Category
   * @param {String} menuItem The ID of the menu item will be used for the event label
   * @param {Number} [onOff] optional - should be 1 or 0 representing on or off state of the menu item
   */
  menuClick(menuSection, menuItem, onOff){
    this.event(menuSection, 'click', menuItem, onOff);
  }
}

const track = new GA('UA-116652541-1');
export default track;
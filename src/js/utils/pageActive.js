/**
 * Page Activity Monitor
 */

class PageActive {
  idleTimeout = false

  onIdle = function() {}
  onActive = function() {}

  /**
   * Whether the mouse and key events are active
   */
  eventsOn = false

  constructor(inActivityWait, restartWait = 1000) {
    this.inActivityWait = inActivityWait;
    this.restartWait = restartWait;
    this.setupEvents();
    this.startIdleTimer();
  }

  dispatch(isActive) {
    if (isActive) {
      this.onActive()
    } else {
      this.onIdle()
    }
  }

  /**
   * Activity was detected
   */
  onActivity = () => {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }

    // clear the events if they were set up
    if (this.eventsOn) {
      document.removeEventListener("mousemove", this.onActivity);
      document.removeEventListener("keydown", this.onActivity);
      this.eventsOn = false;
    }

    if (document.hasFocus()) {
      // dont setup key/mouse events for a bit
      setTimeout(this.startIdleTimer, this.restartWait);
      // notify that activity was detected
      this.dispatch(true);
    }
  };

  /**
   * this runs when the idle timer expired meaning no movement on the
   * page has been detected or user is off page in another tab or program
   */
  isIdle = () => {
    this.idleTimeout = false;
    this.dispatch(false);
  };

  /**
   * Start a timer and listen for events
   * if an event is found, run: onActivity
   */
  startIdleTimer = () => {
    this.idleTimer();
    document.addEventListener("mousemove", this.onActivity);
    document.addEventListener("keydown", this.onActivity);
    this.eventsOn = true;
  };

  idleTimer = () => {
    clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(this.isIdle, this.inActivityWait);
  };

  setupEvents() {
    window.addEventListener("blur", this.idleTimer);
    window.addEventListener("focus", this.onActivity);
  }
}

/*
usage:
var p = new PageActive(5000);
p.onIdle = function() {
  console.log("page has been idle for 5 sec");
}
p.onActive = function() {
  console.log("page is active again");
}
*/



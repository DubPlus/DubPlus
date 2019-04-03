/**
 * Page Potentially hidden
 * refactor of code from: https://stackoverflow.com/a/9502074/395414
 * targetting IE11+ and last couple versions of Chrome, FF, and Safari
 * Desktop only
 */

var potentialPageVisibility = {
  pageVisibilityChangeThreshold: 3 * 3600, // in seconds
  init: function() {
    document.potentialHidden = false;
    document.potentiallyHiddenSince = 0;
    
    var timeout;

    var lastActionDate = null;
    var hasFocusLocal = true;
    var hasMouseOver = true;
    var timeoutHandler = null;

    function setAsNotHidden() {
      var dispatchEventRequired = document.potentialHidden;
      document.potentialHidden = false;
      document.potentiallyHiddenSince = 0;
      if (dispatchEventRequired) dispatch();
    }

    function initPotentiallyHiddenDetection() {
      if (!hasFocusLocal) {
        // the window does not has the focus => check for  user activity in the window
        lastActionDate = new Date();
        if (timeoutHandler != null) {
          clearTimeout(timeoutHandler);
        }
        timeoutHandler = setTimeout(
          checkPageVisibility,
          potentialPageVisibility.pageVisibilityChangeThreshold * 1000 + 100
        ); // +100 ms to avoid rounding issues under Firefox
      }
    }

    function dispatch() {
      var event = new Event('potentialvisilitychange');
      document.dispatchEvent(event);
    }

    function checkPageVisibility() {
      var potentialHiddenDuration =
        hasFocusLocal || lastActionDate == null
          ? 0
          : Math.floor(
              (new Date().getTime() - lastActionDate.getTime()) / 1000
            );
      document.potentiallyHiddenSince = potentialHiddenDuration;
      if (
        potentialHiddenDuration >=
          potentialPageVisibility.pageVisibilityChangeThreshold &&
        !document.potentialHidden
      ) {
        // page visibility change threshold raiched => raise the even
        document.potentialHidden = true;
        dispatch();
      }
    }

    

    // register to the W3C Page Visibility API
    // only fires when you change tabs
    document.addEventListener("visibilitychange", function(event) {
      console.log('visibilitychange:', document.hidden);
      dispatch();
    });
    // document.addEventListener("pageshow", function(event) {
    //   console.log('doc.pageshow:', document.hidden);
    // });
    // document.addEventListener("pagehide", function(event) {
    //   console.log('doc.pagehide:', document.hidden);
    // });
    window.addEventListener("pageshow", function(event) {
      console.log('win.pageshow:', document.hidden);
    });
    window.addEventListener("pagehide", function(event) {
      console.log('win.pagehide:', document.hidden);
    });

    document.addEventListener("mousemove", function(event) {
      lastActionDate = new Date();
    });
    document.addEventListener("mouseover", function(event) {
      hasMouseOver = true;
      setAsNotHidden();
    });
    document.addEventListener("mouseout", function(event) {
      hasMouseOver = false;
      initPotentiallyHiddenDetection();
    });
    window.addEventListener("blur", function(event) {
      hasFocusLocal = false;
      initPotentiallyHiddenDetection();
    });
    window.addEventListener("focus", function(event) {
      hasFocusLocal = true;
      setAsNotHidden();
    });
    setAsNotHidden();
  }
};

potentialPageVisibility.pageVisibilityChangeThreshold = 4; // 4 seconds for testing
potentialPageVisibility.init();

// register to the potential page visibility change
document.addEventListener("potentialvisilitychange", function(event) {
  if (document.hidden) {
    log("page is hidden");
  } else {
    log("page is back");
  }
});

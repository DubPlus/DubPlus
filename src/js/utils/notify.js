/* global Dubtrack */
var isActiveTab = true;

const statuses = {
  denyDismiss : {
    title: "Desktop Notifications",
    content:
      "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site."
  },
  noSupport : {
    title: "Desktop Notifications",
    content:
      "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox"
  }
};

window.onfocus = function () {
  isActiveTab = true;
};

window.onblur = function () {
  isActiveTab = false;
};

export function notifyCheckPermission(cb){
  var _cb = typeof cb === 'function' ? cb :  function(){};

  // first check if browser supports it
  if (!("Notification" in window)) {
    return _cb(false, statuses.noSupport);
  }

  // no request needed, good to go
  if (Notification.permission === "granted") {
    return _cb(true, 'granted');
  }

  if (Notification.permission !== 'denied') {

    Notification.requestPermission().then(function(result) {
      if (result === 'denied' || result === 'default') {
        _cb(false, statuses.denyDismiss);
        return;
      }

      return _cb(true, 'granted');
    });

  } else {
    return _cb(false, statuses.denyDismiss)
  }
}


export function showNotification (opts){
  var defaults = {
    title : 'New Message',
    content : '',
    ignoreActiveTab : false,
    callback : null,
    wait : 5000
  };
  var options = Object.assign({}, defaults, opts);

  // don't show a notification if tab is active
  if (isActiveTab === true && !options.ignoreActiveTab) { return; }

  var notificationOptions = {
    body: options.content,
    icon: "https://res.cloudinary.com/hhberclba/image/upload/c_lpad,h_100,w_100/v1400351432/dubtrack_new_logo_fvpxa6.png"
  };

  var n = new Notification(options.title, notificationOptions);

  n.onclick = function() {
    window.focus();
    if (typeof options.callback === "function") { options.callback(); }
    n.close();
  };
  setTimeout(n.close.bind(n), options.wait);
}


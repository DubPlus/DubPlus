/* global Dubtrack */
import { updateModalState } from "../lib/stores/modalState.svelte";
import { activeTabState } from "../lib/stores/activeTabState.svelte";

function onDenyDismiss() {
  updateModalState({
    id: "notify_denied",
    title: "Desktop Notifications",
    content:
      "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site.",
    open: true,
  });
}

export function notifyCheckPermission() {
  return new Promise((resolve, reject) => {
    // first check if browser supports it
    if (!("Notification" in window)) {
      updateModalState({
        open: true,
        id: "notify_not_supported",
        title: "Desktop Notifications",
        content:
          "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox",
      });
      reject(false);
      return;
    }

    // no request needed, good to go
    if (Notification.permission === "granted") {
      resolve();
      return;
    }

    if (Notification.permission === "denied") {
      onDenyDismiss();
      reject();
      return;
    }

    // persmission unknown, request it
    Notification.requestPermission().then(function (result) {
      if (result === "denied" || result === "default") {
        onDenyDismiss();
        reject();
        return;
      }

      resolve();
    });
  });
}

/**
 *
 * @param {object} opts
 * @param {string} opts.title
 * @param {string} [opts.content]
 * @param {boolean} [opts.ignoreActiveTab]
 * @param {function|null} [opts.callback]
 * @param {number} [opts.wait]
 * @returns
 */
export function showNotification(opts) {
  const defaults = {
    content: "",
    ignoreActiveTab: false,
    callback: null,
    wait: 5000,
  };
  const options = Object.assign({}, defaults, opts);

  // don't show a notification if tab is active
  if (activeTabState.isActive && !options.ignoreActiveTab) {
    return;
  }

  const notificationOptions = {
    body: options.content,
    icon: "https://cdn.jsdelivr.net/gh/DubPlus/DubPlus/images/dubplus.svg",
  };

  const n = new Notification(options.title, notificationOptions);

  n.onclick = function () {
    window.focus();
    if (typeof options.callback === "function") {
      options.callback();
    }
    n.close();
  };

  // close automatically after 5 seconds
  setTimeout(n.close.bind(n), options.wait);
}

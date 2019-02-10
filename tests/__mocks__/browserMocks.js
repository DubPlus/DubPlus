// Mock Browser API's which are not supported by JSDOM, e.g. ServiceWorker, LocalStorage

/**************************************************************
 * localStorage in-memory replacement
 * very basic rudamentary version that works for the needs
 * of this repo
 */

function MyStorage() {
  this.length = 0;
}
MyStorage.prototype = {
  getItem: function(key) {
    if (this[key]) {
      return this[key];
    }
    return null;
  },
  setItem: function(key, value) {
    this[key] = value;
    this.length++;
  },
  removeItem: function(key) {
    if (this[key]) {
      delete this[key];
      this.length--;
    }
  },
  clear: function() {
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        delete this[key];
      }
    }
    this.length = 0;
  }
};

Object.defineProperty(window, "localStorage", {
  value: new MyStorage()
});

/**************************************************************
 * indexedDB in-memory replacement
 */

const indexedDB = require("fake-indexeddb");
Object.defineProperty(window, "indexedDB", {
  value: indexedDB
});

/**************************************************************
 * custom variables on the global window object
 */

// var gitInfo = require('../../tasks/repoInfo.js');
Object.defineProperty(window, "_RESOURCE_SRC_", {
  // value: gitInfo.resourceSrc
  value: "/test/"
});

import emojify from "./emojify.js";
Object.defineProperty(window, "emojify", {
  value: emojify
});

/**************************************************************
 * XHR replacement
 */

import request from "request";

function MockXHR() {
  this.responseText = null;
  this.options = {};
}
MockXHR.prototype = {
  open: function(method, url) {
    // method ignored, we're only doing GET
    this.options.url = url;
  },

  send: function() {
    this.onerror = this.onerror.bind(this);
    this.onload = this.onload.bind(this);
    request(this.options, (error, response, body) => {
      if (error) {
        this.onerror(error);
        return;
      }
      this.responseText = body;
      this.onload();
    });
  },

  setRequestHeader: function(h, val) {
    this.options.headers = this.options.headers || {};
    this.options.headers[h] = val;
  }
};
Object.defineProperty(window, "XMLHttpRequest", {
  value: MockXHR
});
